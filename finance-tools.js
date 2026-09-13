/* ==========================================================================
   FINANCIAL TOOLS SUITE - CA TUSHAR GUPTA
   1. Tab Switcher
   2. Income Tax Calculator (New Regime)
   3. Advance Tax Calculator (Sec 208/211)
   4. GST Calculator (Inclusive/Exclusive)
   5. Loan & EMI Calculator
   6. Mutual Fund / SIP ROI Calculator
   ========================================================================== */

// Indian Rupee currency formatter utility
const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(Math.round(amount));
};

/* --------------------------------------------------------------------------
   1. TAB SWITCHER LOGIC
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const toolPanels = document.querySelectorAll('.tool-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            toolPanels.forEach(p => p.classList.remove('active'));

            // Activate clicked tab and corresponding panel
            btn.classList.add('active');
            const targetTool = document.getElementById(btn.dataset.target);
            if (targetTool) {
                targetTool.classList.add('active');
            }
        });
    });

    // Initialize all calculators
    initIncomeTaxCalc();
    initAdvanceTaxCalc();
    initGstCalc();
    initEmiCalc();
    initMutualFundCalc();
});


/* --------------------------------------------------------------------------
   2. INCOME TAX CALCULATOR (New Tax Regime)
   Slabs:
   Up to 3L: Nil | 3L-7L: 5% | 7L-10L: 10% | 10L-12L: 15% | 12L-15L: 20% | >15L: 30%
   Standard Deduction: ₹75,000 | Section 87A Rebate: up to ₹7,00,000 taxable income
   Health & Education Cess: 4%
   -------------------------------------------------------------------------- */
function initIncomeTaxCalc() {
    const incomeInput = document.getElementById('it-income');
    const stdDedCheck = document.getElementById('it-std-ded');
    const otherDedInput = document.getElementById('it-other-ded');

    const itTaxable = document.getElementById('it-res-taxable');
    const itTax = document.getElementById('it-res-tax');
    const itCess = document.getElementById('it-res-cess');
    const itTotal = document.getElementById('it-res-total');

    function calculateIncomeTax() {
        const grossIncome = parseFloat(incomeInput.value) || 0;
        const stdDed = stdDedCheck && stdDedCheck.checked ? 75000 : 0;
        const otherDed = parseFloat(otherDedInput.value) || 0;

        const taxableIncome = Math.max(0, grossIncome - stdDed - otherDed);
        let tax = 0;

        // Rebate under 87A: If taxable income <= 7,00,000, tax liability is NIL
        if (taxableIncome > 700000) {
            // Slab Calculations
            if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
            if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
            if (taxableIncome > 1000000) tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
            if (taxableIncome > 700000) tax += Math.min(taxableIncome - 700000, 300000) * 0.10;
            if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
        }

        const cess = tax * 0.04;
        const totalTax = tax + cess;

        itTaxable.textContent = formatINR(taxableIncome);
        itTax.textContent = formatINR(tax);
        itCess.textContent = formatINR(cess);
        itTotal.textContent = formatINR(totalTax);
    }

    if (incomeInput) {
        incomeInput.addEventListener('input', calculateIncomeTax);
        stdDedCheck.addEventListener('change', calculateIncomeTax);
        otherDedInput.addEventListener('input', calculateIncomeTax);
        calculateIncomeTax();
    }
}


/* --------------------------------------------------------------------------
   3. ADVANCE TAX CALCULATOR (Sec 208 / 211)
   Schedule: 15% (15 June), 45% (15 Sept), 75% (15 Dec), 100% (15 Mar)
   -------------------------------------------------------------------------- */
function initAdvanceTaxCalc() {
    const totalTaxEst = document.getElementById('adv-tax-est');
    const tdsDeducted = document.getElementById('adv-tds');

    const netAdvTaxEl = document.getElementById('adv-net-tax');
    const q1El = document.getElementById('adv-q1');
    const q2El = document.getElementById('adv-q2');
    const q3El = document.getElementById('adv-q3');
    const q4El = document.getElementById('adv-q4');
    const advNotice = document.getElementById('adv-notice');

    function calculateAdvanceTax() {
        const estTax = parseFloat(totalTaxEst.value) || 0;
        const tds = parseFloat(tdsDeducted.value) || 0;
        const netTaxLiability = Math.max(0, estTax - tds);

        netAdvTaxEl.textContent = formatINR(netTaxLiability);

        if (netTaxLiability < 10000) {
            advNotice.textContent = "Net tax liability is below ₹10,000. Advance tax is not applicable (Sec 208).";
            q1El.textContent = formatINR(0);
            q2El.textContent = formatINR(0);
            q3El.textContent = formatINR(0);
            q4El.textContent = formatINR(0);
        } else {
            advNotice.textContent = "Applicable under Section 208 (Liability exceeds ₹10,000).";
            // Cumulative payment schedules
            const q1 = netTaxLiability * 0.15;
            const q2 = (netTaxLiability * 0.45) - q1;
            const q3 = (netTaxLiability * 0.75) - (q1 + q2);
            const q4 = netTaxLiability - (q1 + q2 + q3);

            q1El.textContent = `${formatINR(q1)} (15%)`;
            q2El.textContent = `${formatINR(q2)} (Cumulative 45%)`;
            q3El.textContent = `${formatINR(q3)} (Cumulative 75%)`;
            q4El.textContent = `${formatINR(q4)} (Cumulative 100%)`;
        }
    }

    if (totalTaxEst) {
        totalTaxEst.addEventListener('input', calculateAdvanceTax);
        tdsDeducted.addEventListener('input', calculateAdvanceTax);
        calculateAdvanceTax();
    }
}


/* --------------------------------------------------------------------------
   4. GST CALCULATOR (Exclusive / Inclusive Modes)
   -------------------------------------------------------------------------- */
function initGstCalc() {
    const amountInput = document.getElementById('gst-amount');
    const rateSelect = document.getElementById('gst-rate');
    const typeRadios = document.querySelectorAll('input[name="gst-type"]');

    const resNet = document.getElementById('gst-res-net');
    const resGst = document.getElementById('gst-res-gst');
    const resCgst = document.getElementById('gst-res-cgst');
    const resSgst = document.getElementById('gst-res-sgst');
    const resTotal = document.getElementById('gst-res-total');

    function calculateGST() {
        const inputAmount = parseFloat(amountInput.value) || 0;
        const rate = parseFloat(rateSelect.value) || 0;
        const isInclusive = document.querySelector('input[name="gst-type"]:checked').value === 'inclusive';

        let netAmount = 0;
        let gstAmount = 0;
        let totalAmount = 0;

        if (isInclusive) {
            // Price includes GST: Net = Price / (1 + Rate/100)
            netAmount = inputAmount / (1 + (rate / 100));
            gstAmount = inputAmount - netAmount;
            totalAmount = inputAmount;
        } else {
            // Price excludes GST: GST = Price * (Rate/100)
            netAmount = inputAmount;
            gstAmount = inputAmount * (rate / 100);
            totalAmount = inputAmount + gstAmount;
        }

        const halfGst = gstAmount / 2;

        resNet.textContent = formatINR(netAmount);
        resGst.textContent = formatINR(gstAmount);
        resCgst.textContent = formatINR(halfGst);
        resSgst.textContent = formatINR(halfGst);
        resTotal.textContent = formatINR(totalAmount);
    }

    if (amountInput) {
        amountInput.addEventListener('input', calculateGST);
        rateSelect.addEventListener('change', calculateGST);
        typeRadios.forEach(radio => radio.addEventListener('change', calculateGST));
        calculateGST();
    }
}


/* --------------------------------------------------------------------------
   5. LOAN & EMI CALCULATOR (With Sliders)
   -------------------------------------------------------------------------- */
function initEmiCalc() {
    const loanInput = document.getElementById('loan-amount');
    const loanRange = document.getElementById('loan-amount-range');
    const rateInput = document.getElementById('interest-rate');
    const rateRange = document.getElementById('interest-rate-range');
    const tenureInput = document.getElementById('loan-tenure');
    const tenureRange = document.getElementById('loan-tenure-range');

    const resEmi = document.getElementById('res-emi');
    const resPrincipal = document.getElementById('res-principal');
    const resInterest = document.getElementById('res-interest');
    const resTotal = document.getElementById('res-total');
    const barPrincipal = document.getElementById('bar-principal');
    const barInterest = document.getElementById('bar-interest');

    function calculateEMI() {
        const P = parseFloat(loanInput.value) || 0;
        const annualRate = parseFloat(rateInput.value) || 0;
        const tenureYears = parseFloat(tenureInput.value) || 0;

        const r = (annualRate / 12) / 100;
        const n = tenureYears * 12;

        if (P > 0 && r > 0 && n > 0) {
            const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = emi * n;
            const totalInterest = totalPayment - P;

            const principalPct = Math.round((P / totalPayment) * 100);
            const interestPct = 100 - principalPct;

            resEmi.textContent = formatINR(emi);
            resPrincipal.textContent = formatINR(P);
            resInterest.textContent = formatINR(totalInterest);
            resTotal.textContent = formatINR(totalPayment);

            if (barPrincipal && barInterest) {
                barPrincipal.style.width = `${principalPct}%`;
                barInterest.style.width = `${interestPct}%`;
            }
        }
    }

    function sync(num, rng) {
        num.addEventListener('input', () => { rng.value = num.value; calculateEMI(); });
        rng.addEventListener('input', () => { num.value = rng.value; calculateEMI(); });
    }

    if (loanInput && loanRange) {
        sync(loanInput, loanRange);
        sync(rateInput, rateRange);
        sync(tenureInput, tenureRange);
        calculateEMI();
    }
}


/* --------------------------------------------------------------------------
   6. MUTUAL FUND & SIP ROI CALCULATOR
   Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
   -------------------------------------------------------------------------- */
function initMutualFundCalc() {
    const sipAmountInput = document.getElementById('sip-amount');
    const sipRange = document.getElementById('sip-amount-range');
    const roiInput = document.getElementById('sip-roi');
    const roiRange = document.getElementById('sip-roi-range');
    const yearsInput = document.getElementById('sip-years');
    const yearsRange = document.getElementById('sip-years-range');

    const resInvested = document.getElementById('sip-res-invested');
    const resReturns = document.getElementById('sip-res-returns');
    const resTotalValue = document.getElementById('sip-res-total');
    const barInvested = document.getElementById('sip-bar-invested');
    const barGain = document.getElementById('sip-bar-gain');

    function calculateSIP() {
        const P = parseFloat(sipAmountInput.value) || 0;
        const annualRate = parseFloat(roiInput.value) || 0;
        const years = parseFloat(yearsInput.value) || 0;

        const i = (annualRate / 12) / 100;
        const n = years * 12;

        if (P > 0 && i > 0 && n > 0) {
            // Future value of SIP
            const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
            const totalInvested = P * n;
            const estimatedReturns = totalValue - totalInvested;

            const investedPct = Math.round((totalInvested / totalValue) * 100);
            const gainPct = 100 - investedPct;

            resInvested.textContent = formatINR(totalInvested);
            resReturns.textContent = formatINR(estimatedReturns);
            resTotalValue.textContent = formatINR(totalValue);

            if (barInvested && barGain) {
                barInvested.style.width = `${investedPct}%`;
                barGain.style.width = `${gainPct}%`;
            }
        }
    }

    function sync(num, rng) {
        num.addEventListener('input', () => { rng.value = num.value; calculateSIP(); });
        rng.addEventListener('input', () => { num.value = rng.value; calculateSIP(); });
    }

    if (sipAmountInput && sipRange) {
        sync(sipAmountInput, sipRange);
        sync(roiInput, roiRange);
        sync(yearsInput, yearsRange);
        calculateSIP();
    }
}