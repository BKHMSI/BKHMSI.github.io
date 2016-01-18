<?php
        $c1 = $_POST['c1'];
        $c2 = $_POST['c2'];
        echo exec("sudo python getHtml.py .$c1 .$c2");
?>