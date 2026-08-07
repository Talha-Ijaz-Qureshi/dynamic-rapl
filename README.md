# Dynamic RAPL daemon for Intel laptops

Dynamic RAPL `drapl` is a lightweight Linux daemon for Intel processors that applies user-defined power limits dynamically based  on the system's active power profile and AC/battery power state.

Currently this program is only supported with [TLP](https://github.com/linrunner/TLP). It relies on its `Performance`, `Balanced` and `Power Saver` profiles, and  whether the system is on AC or battery. This effectively allows you to set limits for 6 independent power states. Intel RAPL (Running Average Power Limit) is a real-time energy consumption monitoring and enforcing power limits on the CPU. This program uses `intel-rapl-mmio` interface to directly update the PL1 and PL2 when it detects a change in power profile or power supply state.

PL (Power Limit) are thresholds that determine the maximum wattage budget of a CPU at different performance states. These values vary drastically from CPU-to-CPU, it is completely dependent on the CPU model, laptop vendor, TDPs, cooling solutions and so on.

- `PL2` Determines the absolute maximum power limit that the CPU is allowed to boost to for short-term tasks, it typically lasts anywhere from 1-28 seconds (Tau) by default to momentarily provide bursts of performance. These values are mostly representative of the maximum Turbo Boost wattages for the CPU.
- `PL1` Determines the average power limit the CPU can draw for long-term tasks, during sustained workloads. This is the power level PL2 will normally fallback on once power is continuously drawn from the system. It'll always be a much lower than PL2 but around the ballpark of the CPU's TDP.

The program is a by-product of my insane obsession for battery life, optimisation, performance and controlling system parameters. It essentially is a fancier implementation of:

```bash
echo 75000000 | sudo tee /sys/class/powercap/intel-rapl-mmio/intel-rapl-mmio:0/constraint_1_power_limit_uw # 75W for PL2
```

Which is the original roots of this program, when I needed to manually control my laptop's power limits, an i7-11850H that boosts to 100+ watts that's just barely holding on to its "intended" performance window despite a vapour chamber heatsink and a liquid-metal mod burning palms and deafening me, or when I needed to push it to its absolute max, or when I needed it to last me all day and have it pinned at its lowest possible wattage (just barely functional and very stuttery, your mileage may vary).

It quickly became tedious having to update `constraint_1_power_limit_uw` and `constraint_0_power_limit_uw` to tie my ideal wattages to my workloads. So I found a way to set per-state wattages depending on what power profile TLP was currently active in, and whether if my system was connected to AC or on battery, allowing granular control for each state via a simple bash script and a watcher service. But I decided to flesh out the idea with this project since I can't recall any other well-known tool offering this exact [rather niche] solution.

## Features

- Processor PL1 and PL2 configurable for 6 independent power states
- Dynamically updates power limits when you switch power profiles or switch AC/DC
- Auto-loads updated values when `/etc/drapl.conf` is changed and saved
- Re-applies configuration from suspend or hibernation
- `install.sh` auto-generates the `/etc/drapl.conf` with your system's original defaults

## Installation

### Prerequisites

- Intel platform
- [TLP](https://github.com/linrunner/TLP) as your power management tool
- inotify-tools
- systemd

For Debian, Ubuntu, and derivatives

```bash
sudo apt install git inotify-tools
```

For RedHat, Fedora, and derivatives

```bash
sudo dnf install git inotify-tools
```

For Arch Linux, and derivatives

```bash
sudo pacman -S inotify-tools
```

For openSUSE

```bash
sudo zypper install inotify-tools
```

### Quick Install

```bash
git clone https://github.com/Talha-Ijaz-Qureshi/dynamic-rapl
cd dynamic-rapl
sudo ./install.sh
```

The script will automatically generate the `drapl.conf` file with your system's default power limits, and start the daemon.

## Usage

### Configuration

The 6 drapl profiles are stored in `/etc/drapl.conf`, each profile contains PL1 and PL2 values:

```bash
# AC Power Limits
# Balanced
AC_BAL_PL1=
AC_BAL_PL2=

# Performance
AC_PERF_PL1=
AC_PERF_PL2=

# Power Saver
AC_PS_PL1=
AC_PS_PL2=

# Battery Power Limits
# Balanced
BAT_BAL_PL1=
BAT_BAL_PL2=

# Performance
BAT_PERF_PL1=
BAT_PERF_PL2=

# Power Saver
BAT_PS_PL1=
BAT_PS_PL2=

```

I recommend you study the TDP and the default PL values for your system, and experiment different values to determine the best solution for your system, you can adjust these profiles to either allow setting higher power budgets than your system originally enforced for higher performance, or throttle power for better efficiency.

It is generally safe to set very high values as your system will automatically stay within the hardware limits, but you must ensure the system is well-cooled and not throttling more than expected to avoid overheating the laptop.

Most power management tools focus on optimising performance via CPU scaling governers, EPP (Energy Performance Preference) and Turbo Boost, that dictate the processor's frequency, thus the power draw for the CPU. For example, if you choose to put 45W on power saver mode, TLP will by default be using the `power` EPP and Turbo Boost disabled, which limits the CPU to its base frequency (i.e 2.5GHz for my processor), so its power draw will be capped to a much lower number. The maximum power draw also depends on your laptop's AC or battery state. In my case, on AC, my i7-11850H can pull up to 115W, but only 65W at most on battery (even lower if the dGPU is enabled). This tool will ensure your system respects power draw limits on the CPU, but won't necessarily force your CPU to make full use of the limits, that's primiarily up to how your CPU governers, EPP and boost settings are configured. Default TLP settings should behave mostly as expected.

### Check the service

```bash
sudo systemctl status dynamic-rapl.service
```

### Force apply drapl profiles

```bash
sudo /usr/local/bin/drapld --apply
```

### Keep system defaults

```bash
sudo systemctl stop dynamic-rapl.service
# Your default values are stored in /etc/drapl.conf incase you forget, insert them below
echo <PL1>000000 | sudo tee /sys/class/powercap/intel-rapl-mmio/intel-rapl-mmio:0/constraint_0_power_limit_uw 
echo <PL2>000000 | sudo tee /sys/class/powercap/intel-rapl-mmio/intel-rapl-mmio:0/constraint_1_power_limit_uw 

```

### Uninstall drapl entirely

```bash
sudo systemctl stop dynamic-rapl drapl-resume
sudo systemctl disable dynamic-rapl drapl-resume
sudo rm /etc/systemd/system/dynamic-rapl.service
sudo rm /etc/systemd/system/drapl-resume.service
sudo rm -rf /etc/systemd/system/dynamic-rapl.service.d
sudo rm /usr/local/bin/drapld
sudo rm /etc/drapl.conf
sudo rm /var/log/drapl.log 2>/dev/null
sudo systemctl daemon-reload
```

## Technical Breakdown

The drapl runs as a systemd daemon `dynamic-rapl.service`. The daemon is a bash script `/usr/local/bin/drapld` that monitors `/etc/drapl.conf` and `/run/tlp/last_pwr` to apply the drapl profiles, the set of systemd services provided allow drapl to re-apply the configuration upon resume from suspend, hibernation or hybrid sleep.

`/run/tlp/last_pwr` outputs TLP's current power profile and the system's AC/Battery state. I.e:

```bash
$ cat /run/tlp/last_pwr
1 0 # <Profile> <Power Supply> In this case 1=Balanced 0=AC

```

TLP power profiles: `Performance=0`, `Balanced=1`, `Power Saver=2`.
TLP power supply: `AC=0`, `Battery=1`

The daemon reads these values and maps them to one of the six drapl profiles, each with the user-defined PL1 and PL2 values from `/etc/drapl.conf`, and writes them to:

```bash
/sys/class/powercap/intel-rapl-mmio/intel-rapl-mmio:0/constraint_0_power_limit_uw # PL1
/sys/class/powercap/intel-rapl-mmio/intel-rapl-mmio:0/constraint_1_power_limit_uw # PL2

```

The daemon reacts to the change in states for both tlp's values and the `.conf` file via `inotifywait` to watch for changes to either files, and once a change is detected the daemon re-evaluates the new system state and applies the update. Allowing auto-reload for new configuration and dynamic drapl profile switching.

## Limitations and Prospect

- No option to control Tau (Time Window) for PL2 Turbo Boost yet.
- No perodic update to RAPL registers, only event-driven on state change.
- Default PL values detected vary whether the device is on charge or battery.
- Only supports TLP
- Only supports systemd system service
- Only for Intel platforms
- I have not tested many Intel processors yet.
- Scope of the project is limited to laptops/battery powered systems.

### Devices currently tested

This list will grow overtime as I confirm support myself, feel free to let me know if it works on your system

| Brand | CPU | Laptop |
| :--- | :--- | --- |
| HP | i7-11850H | ZBook Studio G8 |
| Lenovo | i7-9850H | ThinkPad P53 |

### To do

Though it has not been a problem for me so far (which is impressive given the absolute dense nature of HP's EC chips), future versions will iteratively address these concerns or any other that you feel to bring up in the issues tab.

The next primary goal is to make drapl support other commonly used power management tools like ppd and system76-power.

## Feel free to contribute

Your contributions are very welcomed, whether its opening an issue or a PR. Feel free to do so!

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

2026 - Dynamic RAPL (drapl) by Talha "tal" Ijaz
