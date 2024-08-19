class solarcalc {

    maxM2 = 1000; //The maximum allowed m2 input
    panelEfficiency = 0.15; //The efficiency of the panels - 15%
    sunHoursPerYear = 5800; //The hours of sunlight over the year
    calculateFactor = 950.10; //The factor to calculate the kWh

    /**
     * Constructs a new instance of the solarcalc class.
     *
     * @param {Object} parameters - An object containing any necessary parameters for the constructor.
     * @return {void} This function does not return anything.
     */
    constructor(parameters) {
        this.updateValues();
        this.calculate(this.m2, this.rooftype);
        this.clearErrors();

        jQuery('.solarcalc #m2-input').on('change', (e) => {
            this.updateValues();
            this.clearErrors();
            if (this.m2 < 1 || this.m2 > 1000) {
                jQuery('.solarcalc #m2-error').text(`Der Wert muss zwischen 1 und ${this.maxM2} m2 liegen.`, 'solarcalc');
                return;
            }
            this.calculate(this.m2, this.rooftype);
        });
        jQuery('.solarcalc #rooftype').on('change', (e) => {
            this.updateValues();
            this.clearErrors();
            this.calculate(this.m2, this.rooftype);
        });

        jQuery('.solarcalc #sc-rooftype-icons a').on('click', (e) => {
            this.changeHouseType(e);
        });
        jQuery('.solarcalc #sc-rooftype-icons a').on('keypress', (e) => {
            if (e.which == 13) {
                this.changeHouseType(e);
            }
        });
    }

    /**
     * Changes the selected house type and updates the corresponding input field.
     *
     * @param {Event} e - The event object representing the click or keypress event.
     * @return {void} This function does not return anything.
     */
    changeHouseType(e) {
        jQuery('.solarcalc #sc-rooftype-icons a').removeClass('active');
        jQuery(e.currentTarget).addClass('active');
        jQuery('.solarcalc #rooftype').val(jQuery(e.currentTarget).data('type'));
        jQuery('.solarcalc #rooftype').change();
    }

    /**
     * Calculates the total investment, battery cost, and energy production for a solar panel system.
     *
     * @param {number} m2 - The total area of the solar panels in square meters.
     * @param {string} rooftype - The type of roof the solar panels will be installed on (flat, steep, or indach).
     * @return {void} This function does not return anything.
     */
    calculate(m2, rooftype) {
        let kwpPerM2 = 0;
        let costPerM2 = 0;
        let sizeModule = 1.65; //Size in m2
        let factor = this.calculateFactor;
        let einmalverguetung = 0;

        switch (rooftype) {
            case 'flat':
                kwpPerM2 = 0.225;
                costPerM2 = 360;
                einmalverguetung = 380;
                break;
            case 'steep':
                kwpPerM2 = 0.22;
                costPerM2 = 345;
                factor = factor * 0.95;
                break;
            case 'indach':
                kwpPerM2 = 0.197;
                costPerM2 = 870;
                einmalverguetung = 420;
                break;

            default:
                break;
        }

        //Update the investition
        let kwpTotal = kwpPerM2 * m2;
        let totalInvest = 9500;
        if (kwpTotal > 19.9) {
            totalInvest + 1000;
        }
        if (kwpTotal > 29.9) {
            totalInvest + 8000;
        }
        if (kwpTotal > 50) {
            totalInvest + 5000;
        }

        //Calculate the Einmalvergütung
        if (kwpTotal > 2) {
            totalInvest = (totalInvest - einmalverguetung);
            //Add a info for the Einmalverguetung
            jQuery('.solarcalc #sc-invest .info .text').html(`<a href="https://pronovo.ch/" target="_blank">Pronovo</a> Einmalvergültung ab 2 kWp`);
            jQuery('.solarcalc #sc-invest .info').addClass('show');
        }else{
            jQuery('.solarcalc #sc-invest .info').removeClass('show');
        }
        totalInvest = (totalInvest + (costPerM2 * m2)).toFixed(0);

        //Calculate the kWh
        let kWh = kwpTotal * factor;
        //kWh = (kWh * m2).toFixed(2);

        //Calculate the battery
        let batt = 0;
        if (kwpTotal <= 10) {
            batt = 4500;
        }
        if (kwpTotal > 10) {
            batt = 6500;
        }

        //Update the numbers
        this.countUp('.output-con #sc-power .number', kwpTotal);
        this.countUp('.output-con #sc-invest .number', totalInvest, 'currency');
        this.countUp('.output-con #sc-invest-batt .number', batt, 'currency');
        this.countUp('.output-con #sc-modules .number', Math.round(m2 / sizeModule));
        this.countUp('.output-con #sc-energy .number', kWh);
    }

    updateValues() {
        this.m2 = parseFloat(jQuery('.solarcalc #m2-input').val());
        this.rooftype = jQuery('.solarcalc #rooftype').val();
    }

    /**
     * Clears any error messages displayed in the solar calculator component.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    clearErrors() {
        jQuery('.solarcalc .error-con').text('');
    }

    /**
    * Counts up from the current value of the given element to the new value over time.
    *
    * @param {jQuery} element - The element to update with the count.
    * @param {number} newVal - The new value to count up to.
    * @param {string} type - The expected type. Supported are: currency
    * @return {void} This function does not return anything.
    */
    countUp(element, newVal, type = '') {
        let oldVal = jQuery(element).val();
        oldVal = (oldVal === '') ? 0 : parseInt(oldVal);
        newVal = parseFloat(newVal);
        const interval = setInterval(() => {
            const increment = newVal / 30;
            oldVal += increment;
            let number = Math.floor(oldVal);
            if (newVal <= oldVal) {
                clearInterval(interval);
                number = newVal;
            }
            if (type === 'currency') {
                jQuery(element).text(number.toLocaleString('de-CH', { style: 'currency', currency: 'CHF' }));
            } else {
                jQuery(element).text(number.toLocaleString('de-CH', { style: 'decimal', maximumFractionDigits: 2 }));

            }
        }, 20);
    }
}

jQuery(document).ready(() => {
    const solarcalculator = new solarcalc;
});