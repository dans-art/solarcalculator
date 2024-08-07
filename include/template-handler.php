<?php

class templateHandler
{

    public $plugin_path = '';

    public function __construct(){
        $this -> plugin_path = WP_PLUGIN_DIR . '/solarcalculator/';
    }

    /**
     * Loads template to variable.
     * @param string $template_name - Name of the template without extension
     * @param string $subfolder - Name of the Subfolder(s). Base folder is Plugin_dir/templates/
     * @param string $template_args - Arguments to pass to the template
     * 
     * @return string Template content or error Message
     */
    public function load_template_to_var(string $template_name = '', string $subfolder = '', ...$template_args)
    {
        $args = get_defined_vars();
        $path = $this->get_template_location($template_name, $subfolder);

        if (file_exists($path)) {
            ob_start();
            include($path);
            $output_string = ob_get_contents();
            ob_end_clean();
            wp_reset_postdata();
            return $output_string;
        }
        return sprintf(__('Template "%s" not found! (%s)', 'plek'), $template_name, $path);
    }

    /**
     * Function to find the template file. First the Child-Theme will be checked. If not found, the file in the plugin will be returned.
     *
     * @param string $template_name - The name of the template.
     * @param string $subfolder - The subfolder the template is in. With tailing \
     * @return string The location of the file.
     */
    public function get_template_location($template_name, $subfolder)
    {
        //Checks if the file exists in the theme or child-theme folder
        $subfolder = (substr($subfolder, -1) !== '/') ? $subfolder . '/' : $subfolder;
        $locate = locate_template('templates/' . $subfolder . $template_name . '.php');

        if (empty($locate)) {
            return str_replace('\\', '/', $this->plugin_path . 'templates' . $subfolder . $template_name . '.php');
        }
        return str_replace('\\', '/', $locate);
    }
}
