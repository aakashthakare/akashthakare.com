---
title: Root Cause Analysis (Basics)
layout: deck.njk
templateEngineOverride: false
---

## Root Cause Analysis (Basics)

<img src='/assets/images/deck/rca-basic/rca_basic_first_slide.png' width='100%' height='500px'/>

---

## What is RCA?

A problem-solving method..

- to identify the underlying cause(s) of an issue.
- to fix actual cause instead of just addressing symptoms.
- to prevent recurring issues.

---

## Why Do We Need RCA?

- To understand the ***why***
- Saves time and money in the longer run.

---

## Key Principles

1. Focus on the cause, not symptoms.
2. Use data, avoid assumptions
3. Don't blame, identify prevention.

---

## Remember

> 💡 There can be multiple root causes!

---

## 6 Step Process

1. Define the Problem
2. Gather Data
3. Identify Possible Causes
4. Find the Root Cause
5. Implement Solutions
6. Monitor Results

---

## Methods

- 5 Whys Analysis: Ask "Why" repeatedly until the root cause is identified.
- Pareto Analysis (80/20 rule).

---

## Example: Ask Why?

Problem: Application Server went down.

1. **Why?** Application Server crashed.
2. **Why?** High memory usage.
3. **Why?** Memory was occupied even after API response.
4. **Why?** Memory leak happened.
5. **Why?** IO resources kept open.

**Root Cause**: Code review process / Lack of Memory leak awareness.

---

## Best Practices

- Involve the right stakeholders.
- Regularly review and document RCA learnings.
- Guide new members with RCA process.
- Share RCA learnings with other members.

---

## 😌 Yes!

> RCA can be super challenging but extremely rewarding if you are passionate about it!
