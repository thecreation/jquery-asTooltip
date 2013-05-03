#jquery-tooltip

jquery-tooltip was designed to make implementation as easy as possible. Before implementing, make sure you meet the minimum requirements.

![image][]
 [image]: https://github.com/amazingSurge/jquery-tooltip/blob/master/demo/img/tooltip.png

### Requirements
- 	jQuery 1.4.x or greater

### Implementation

For the most basic implementation, follow the steps below:

1.	Download the [jquery-tooltip](https://raw.github.com/amazingSurge/jquery-tooltip) Package

2.	Unzip the package and upload the following files into a folder on your website:  

		- 	jquery.tooltip.js
		- 	tooltip.css 

3.	On the page you are implementing tooltip on, add a reference to the jQuery library.

		<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script>

4.	Below the reference to jQuery, add a reference to the tooltip script.

		<script type="text/javascript" src="/jquery.tooltip.js"></script>

5.	On the page, add a input (or any other element with an class works).

		<span class="tooltip-click"  title="this is a simple tooltip">a simple show</span>

6.	Initialize Paginator on the file input. the first argument is the total pages get from your server , the second is options. 
		
		$(document).ready(function() {
		    $(".tooltip-click").tooltip();                         
		});

7.	Add a link to the Paginator stylesheets in the head of the document.

		<link rel="stylesheet" type="text/css" href="tooltip.css" />

8.	The final page should look like the following:

		<!DOCTYPE html>
		<html>
			<head>
			    <title>tooltip</title>
			    <link rel="stylesheet" type="text/css" href="tooltip.css">
			    <script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
			    <script type="text/javascript" src="jquery.tooltip.js"></script>
			    <script type="text/javascript">
				    $(document).ready(function() {
					    $(".tooltip-click").tooltip();                         
					});
			    </script>
			</head>
			<body>
				<span class="tooltip-click"  title="this is a simple tooltip">a simple show</span>
			</body>
		</html>


### Documentation
_(Coming soon)_

### License MIT
_(Coming soon)_

### Release History
_(Nothing yet)_
