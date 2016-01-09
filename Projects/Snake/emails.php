<?php
if(isset($_POST['submit'])) {
$to = "badr@khamissi.com";
$subject = "رسالة";
$name_field = $_POST['name'];
$email_field = $_POST['email'];
$evaluation_field = $_POST['eval'];
$message = $_POST['comments'];
 
$body = "From: $name_field\n E-Mail: $email_field\n Evaluation: $evaluation_field\n Message:\n $message";
 
echo "Thank you $name_field we recieved your feedback";
mail($to, $subject, $body);
} else {
echo "Error!";
}
?>