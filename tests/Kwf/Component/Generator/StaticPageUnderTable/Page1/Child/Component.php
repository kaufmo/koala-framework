<?php
class Kwf_Component_Generator_StaticPageUnderTable_Page1_Child_Component extends Kwc_Abstract
{
    public static function getSettings()
    {
        $ret = parent::getSettings();
        $ret['generators']['page'] = array(
            'class' => 'Kwf_Component_Generator_Page_Static',
            'name' => 'page',
            'component' => 'Kwc_Basic_None_Component'
        );
        return $ret;
    }
}
