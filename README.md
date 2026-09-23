# Mitti2Market 🌾
> **Small Farms. One Powerful Market.**  
> *Smart India Hackathon (SIH) Prototype*

Mitti2Market solves agricultural fragmentation, middleman exploitation, and quality risks through **demand-first procurement pooling**. The platform aggregates smallholder quantities into single, consolidated bulk buyer orders with integrated cold-chain logistics, farm-gate AI quality checks, milestone smart escrow, and automatic standby failover.

---

## 🚀 Key Modules & Innovations

### 1. 🛒 Buyer Portal & Demand-First Pooling
* **Institutional Demand Posting**: Post large requirements (e.g., 1,000 kg Tomato) with early morning delivery targets.
* **Autonomous Matching Engine**: Discovers nearest certified smallholders within a 15 km cluster, calculating algorithmic match scores based on rating, distance, and lot volume.
* **Automatic Standby Failover**: If a matched farmer rejects or falls short on quantity, the standby replacement engine dynamically detours and maintains full order fulfillment.
* **Consolidated Tax Invoice**: Transparent single-billing combining multiple farmers, freight (₹1.0/kg paid by buyer), and platform QA fee (2%).

### 2. 🚜 Farmer Module & Inclusive Participation Simulator
* **Dual Device Simulation**:
  * **Smartphone App**: Modern push notifications, lot offer reviews, counter-offers, and instant UPI payment receipts.
  * **Keypad Feature Phone (IVR)**: Authentic rural IVR simulation with zero smartphone dependency.
    * **Pure Hindi IVR (Zero English loan words)** with Devanagari physical keypad (`१` स्वीकार, `२` अस्वीकार, `३` नया भाव).
    * **Gujarati IVR** support for regional linguistic inclusivity.

### 3. 🚚 Logistics Control Tower & Farm-Gate QC Station
* **Optimized Perishable Collection Run**: Multi-stop pickup route scheduled for 4:00 AM peak farm freshness.
* **Farm-Gate Weighbridge & Agmark QC**:
  * Input actual weighbridge volume and quality grades (A, B, C, Failed).
  * **Shortage Detection & Re-Route**: If verified weight is less than promised, the truck dynamically detours to a standby reserve farmer, updating the buyer portal and invoice in real-time.
  * Quality-based automatic price adjustment.
* **2-Minute Simulated Transit & Doorstep Delivery**: Countdown timer with fast-forward support transitioning directly to the buyer warehouse receiving dock.

### 4. 🔒 Smart Escrow Vault & 2-Phase Milestone Release
* **Milestone 1 (70% Farm-Gate Disbursal)**: 70% escrow locked on order confirmation and disbursed immediately to farmers upon passing farm-gate weight and QC checks.
* **Milestone 2 (Remaining 30% Final Settlement)**: Disbursed directly into farmers' Aadhaar UPI/Bank accounts once the buyer inspects and confirms doorstep delivery intake.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 18 + TypeScript + Vite
* **Styling & UI**: Tailwind CSS + Lucide React Icons
* **Mapping**: Leaflet + React-Leaflet (OpenStreetMap Tiles)
* **Audio & Synthesis**: Web Audio API Chimes + Web Speech Synthesis (hi-IN / gu-IN)
* **Build System**: Vite 5

---

## 🏃 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

Open [http://localhost:5173/](http://localhost:5173/) to interact with the live prototype.
