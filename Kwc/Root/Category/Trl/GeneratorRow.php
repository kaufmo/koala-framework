<?php
class Kwc_Root_Category_Trl_GeneratorRow extends Kwf_Model_Proxy_Row
{
    protected function _beforeInsert()
    {
        parent::_beforeInsert();
        if (!$this->visible) $this->visible = 0;
    }

    protected function _beforeUpdate()
    {
        parent::_beforeUpdate();
        if (in_array('filename', $this->getDirtyColumns())) {
            $model = Kwf_Component_Data_Root::getInstance()
                ->getComponentByDbId($this->component_id, array('ignoreVisible' => true))
                ->generator->getHistoryModel();
            $data = array(
                'component_id' => $this->component_id,
                'filename' => $this->getCleanValue('filename'),
            );
            $row = $model->createRow($data);
            $row->save();
        }
    }

    protected function _beforeDelete()
    {
        throw new Kwf_ClientException(trlKwf("Can't delete translated pages."));
    }
}
