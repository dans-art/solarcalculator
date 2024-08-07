<?php

/**
 * Plugin Name: Solar calculator
 * Description: Adds a solar calculator to your website
 * Contributors: dansart
 * Contributors URL: http://dev.dans-art.ch
 * Tags: solar, calculator, calc
 * Version: 0.2
 * Stable tag: 0.2
 * 
 * Domain Path: /languages
 * Text Domain: solarcalc
 * 
 * Author: Dan's Art
 * Author URI: https://dev.dans-art.ch
 * Donate link: https://paypal.me/dansart13

 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * 
 * 
 * Changelog:
 * - Improved styles
 * - Added mobile styles
 * - Added currency and decimal formatting
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Load the classes
 */
require_once("include/template-handler.php");

add_shortcode('solarcalculator', 'da_show_solar_calc');

function da_show_solar_calc()
{
    wp_enqueue_script('da-solar-calc-script', get_option('siteurl') . '/wp-content/plugins/solarcalculator/js/solar-calc-script.js', array('jquery', 'wp-i18n'), 0.1);

    wp_enqueue_style( 'solarcalc-style', get_option( 'siteurl' ) . '/wp-content/plugins/solarcalculator/style/solar-style.min.css', array());    $th = new templateHandler;
    return $th -> load_template_to_var( 'calculator');
}
