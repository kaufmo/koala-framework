<?php
/**
 * @group Model
 * @group Model_Db
 * @group Model_DbWithConnection
 * @group Model_Db_SelectExpr_Proxy2
 */
class Kwf_Model_DbWithConnection_SelectExpr_WithModel2AsProxy_Test extends Kwf_Model_DbWithConnection_SelectExpr_AbstractTest
{
    public function testIt()
    {
        $m1 = Kwf_Model_Abstract::getInstance('Kwf_Model_DbWithConnection_SelectExpr_WithModel2AsProxy_Model1');
        $m2 = Kwf_Model_Abstract::getInstance('Kwf_Model_DbWithConnection_SelectExpr_WithModel2AsProxy_Proxy2');

        $s = $m1->select();
        $s->order('id');
        $s->expr('count_model2');
        $row = $m1->getRow($s);
        $this->assertEquals($row->id, 1);
        $this->assertEquals($row->count_model2, 3);

        $row->foo = 'a';
        $row->save();
    }
}
