---
layout: layout.njk
title: Idea List
---

# GSoC 2024 cohort idea list:

## Idea 1: Introduce [DMA-BUF backend](https://wayland.app/protocols/wlr-export-dmabuf-unstable-v1) for Wayshot to enable high performance screen capture

### Possible Mentor(s):

- Zubair Mohammed <zubair.mh@protonmail.com>
- Aakash Sen Sharma <aakashsensharma@gmail.com>
- Angelo Fallaria <ba.fallaria@gmail.com>

### Difficulty: Hard
### Project Size: Large (350 hours)
### Skills: Rust

### Description:

Wayshot allows users to perform screen capture / streaming using CPU-copyback which leads to us being bottlenecked by the CPU throughput. This also includes image transformations on the CPU.

With the introduction of a DMA-BUF backend, we aim to expose a client-side API for directly capturing and performing all image-transformations at the GPU level. This enables high performance streaming over applications like OBS using our custom desktop portal backend.

---

## Idea 2: Reiterating SWHKD security model to achieve simpler UX

### Possible Mentor(s):

- Aakash Sen Sharma <aakashsensharma@gmail.com>
- Zubair Mohammed <zubair.mh@protonmail.com>
- Angelo Fallaria <ba.fallaria@gmail.com>

### Difficulty: Medium
### Project Size: Medium (175 hours)
### Skills: Rust

### Description:

Due to the current tedious privilege model of swhkd, user adoption has been rough and flaky. It also led to security vulnerabilities in the past which have been patched since.

This idea aims to replace the current polkit-style privilege escalation to gain hardware access, with a simpler, more robust system. 

This can be achieved in one of two ways by either removing the server-client architecture all together or using linux permission set more efficiently.

---

## Idea 3: Formalize SWHKD parser using regular grammar notation

### Possible Mentor(s):

- Angelo Fallaria <ba.fallaria@gmail.com>
- Zubair Mohammed <zubair.mh@protonmail.com>
- Aakash Sen Sharma <aakashsensharma@gmail.com>

### Difficulty: Medium
### Project Size: Medium (175 hours)
### Skills: Rust

### Description:

The current SWHKD parser had been hand-rolled and is flaky in it's formal description. With this idea we aim to introduce a set of robust DSL rules by defining a formal grammar to rewrite our parser.

This idea aims to replace the current parser to get rid of a host of parser related bugs and lead to better errors messages and UX.
