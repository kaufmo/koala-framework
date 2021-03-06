<?php
class Kwc_Paragraphs_Trl_Component extends Kwc_Chained_Trl_Component
{

    public static function getSettings($masterComponentClass)
    {
        $ret = parent::getSettings($masterComponentClass);
        $ret['componentIcon'] = 'page';
        $ret['generators']['paragraphs']['class'] = 'Kwc_Paragraphs_Trl_Generator';
        $ret['childModel'] = 'Kwc_Paragraphs_Trl_Model';
        $ret['extConfig'] = 'Kwc_Paragraphs_Trl_ExtConfig';
        return $ret;
    }

    public function getTemplateVars(Kwf_Component_Renderer_Abstract $renderer = null)
    {
        $ret = parent::getTemplateVars($renderer);
        $ret['paragraphs'] = array();
        foreach($this->getData()->getChildComponents(array('generator'=>'paragraphs')) as $paragraph) {
            $cssClass = 'kwcParagraphItem';
            $row = $paragraph->chained->row;
            if (Kwc_Abstract::getSetting($this->_getSetting('masterComponentClass'), 'useMobileBreakpoints') && $row->device_visible) {
                $cssClass .= ' ' . $row->device_visible;
            }
            $cssClass .= ' outer'.ucfirst(Kwf_Component_Abstract::formatRootElementClass($paragraph->chained->componentClass, ''));
            $preHtml = '';
            $postHtml = '';
            foreach (Kwf_Component_Data_Root::getInstance()->getPlugins('Kwf_Component_PluginRoot_Interface_MaskComponent') as $plugin) {
                $mask = $plugin->getMaskCode($paragraph->chained);
                $preHtml = $mask['begin'] . $preHtml;
                $postHtml = $postHtml . $mask['end'];
            }
            $ret['paragraphs'][] = array(
                'data' => $paragraph,
                'class' => $cssClass,
                'preHtml' => $preHtml,
                'postHtml' => $postHtml
            );
        }
        return $ret;
    }

    public function hasContent()
    {
        $childComponents = $this->getData()->getChildComponents(array('generator' => 'paragraphs'));
        foreach ($childComponents as $c) {
            if ($c->hasContent()) return true;
        }
        return false;
    }
}
