#!/bin/bash
set -e

if ! command -v inotifywait &> /dev/null; then
    echo "Unmet dependencies: inotify-tools" >&2
    exit 1
fi

if ! systemctl is-active --quiet tlp; then
    echo "Unmet dependencies: TLP isn't present/running." >&2
    exit 1
fi

RAPL_PATH="/sys/class/powercap/intel-rapl-mmio/intel-rapl-mmio:0"

if [[ -f "$RAPL_PATH/constraint_0_power_limit_uw" ]]; then
    DEFAULT_PL1=$(( $(cat "$RAPL_PATH/constraint_0_power_limit_uw") / 1000000 ))
    DEFAULT_PL2=$(( $(cat "$RAPL_PATH/constraint_1_power_limit_uw") / 1000000 ))
    echo "System defaults: PL1=${DEFAULT_PL1}W, PL2=${DEFAULT_PL2}W"
else
    echo "Installation failed, RAPL MMIO path was not found." >&2
    exit 1
fi

cp src/drapld /usr/local/bin/drapld
chmod +x /usr/local/bin/drapld

if [[ ! -f /etc/drapl.conf ]]; then
    cat > /etc/drapl.conf <<EOF
# /etc/drapl.conf - User configuration file
#
# Dynamic RAPL | drapl
# Copyright (c) 2026 - Talha "tal" Ijaz
# Licensed under the MIT License. See LICENSE file in the project root.
#
# To get your default system limits, simply reboot your system without the daemon running.
# Default PL1: $DEFAULT_PL1
# Default PL2: $DEFAULT_PL2
#
# drapl applies Intel RAPL MMIO power limits on the fly depending on the
# current state of your system. This is determined by the current power
# supply and the active TLP power profile. There are 6 possible states.
#   On battery - Balanced, Performance, or Power Saver
#   On AC - Balanced, Performance, or Power Saver
#
# By default the install script will apply the default power limits to 
# all 6 states. In most cases you'll just need to be concerned with
# tweaking 'On battery' states for achieving better battery life, or
# 'AC states' for reducing system noise and heat.
#
# PL (Power Limit) are thresholds that determine the maximum wattage 
# budget of a CPU at different performance states. Values for these 
# vary drastically CPU-to-CPU as it depends heavily on the processor,
# vendor, TDP, cooling solution, and many more factors.
#   PL1: Determines the max wattage for long-term sustained tasks
#   PL2: Determines the max wattage for short-term bursts.
# PL2 is what allows your CPU to boost to very high wattages for quick burst
# performance but it lasts only a couple seconds, the processor will drop
# to PL1 once the boost time expires.
#
# This config file allows you to manually tweak the exact power limits
# for each state your system is in. It will automatically apply updates
# once you edit and save this file.
#
# Note: Only enter POSITIVE INTEGER values for watts.

# AC Power Limits
# Balanced
AC_BAL_PL1=$DEFAULT_PL1
AC_BAL_PL2=$DEFAULT_PL2

# Performance
AC_PERF_PL1=$DEFAULT_PL1
AC_PERF_PL2=$DEFAULT_PL2

# Power Saver
AC_PS_PL1=$DEFAULT_PL1
AC_PS_PL2=$DEFAULT_PL2

# Battery Power Limits
# Balanced
BAT_BAL_PL1=$DEFAULT_PL1
BAT_BAL_PL2=$DEFAULT_PL2

# Performance
BAT_PERF_PL1=$DEFAULT_PL1
BAT_PERF_PL2=$DEFAULT_PL2

# Power Saver
BAT_PS_PL1=$DEFAULT_PL1
BAT_PS_PL2=$DEFAULT_PL2

# Default paths and values, you don't need to change these.
# TLP_STATE_FILE=/run/tlp/last_pwr
# RAPL_MMIO_PATH=$RAPL_PATH
# LOG_ENABLED=1
# LOG_FILE=/var/log/drapl.log
# STATE_PERFORMANCE=0
# STATE_BALANCED=1
# STATE_POWERSAVE=2
EOF
    echo "Config file /etc/drapl.conf has been auto-generated using your system default limits"
else
    echo "Config file already exists"
fi

cp systemd/dynamic-rapl.service /etc/systemd/system/dynamic-rapl.service
cp systemd/drapl-resume.service /etc/systemd/system/drapl-resume.service

mkdir -p /etc/systemd/system/dynamic-rapl.service.d
cp systemd/dynamic-rapl.service.d/resume.conf /etc/systemd/system/dynamic-rapl.service.d/resume.conf

systemctl daemon-reload
systemctl enable --now dynamic-rapl.service
systemctl enable --now drapl-resume.service

echo ""
echo "Dynamic RAPL daemon has been installed and enabled"
echo "Edit /etc/drapl.conf to set your per-state drapl profiles"
echo "Your hardware defaults were: PL1=${DEFAULT_PL1}W, PL2=${DEFAULT_PL2}W (saved in the config file's header as well)"
