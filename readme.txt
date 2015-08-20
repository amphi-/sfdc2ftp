#####
#	CSV exchanger middleware documentation
#	version: 	1.0.0
#	author: 	CowPanda Ltd.
#####

Contents
	1. Overview
	2. Installation
	3. Validation
	4. FTP config
	5. Apache config
	6. Run the server
	7. Reference Error messages


1. Overview

The middleware is written in NodeJS v0.12.7 using the Express.js 4 framework. The middleware receives data from Salesforce via JSON POST, converts the data into a CSV file (Windows-1252 encoded) and uploads it to the configured FTP, returning a custom JSON response to Salesforce for status tracking.


2. Installation

2.1 NodeJS

In order to run NodeJS and use the referenced packages, you need the current version of NodeJS which is available here from https://nodejs.org/download/

2.2 Git

For maintenance and update purposes, please install git https://git-scm.com/download/win

2.3 Clone Repository

Download the application code from bitbucket into the target folder using git’s clone command. The repository is available here https://bitbucket.org/sdoebs/streit . Manfred Streit has access to the repository please request his credentials or provide us with an email address we can add to the repository.

2.4 Dependencies

Install the application dependencies by navigating into the installation folder and run ‘npm install’


3. Validation

Validate the installation by starting the application with ‘npm start’ and open http://localhost:3000/check/server in a browser, the page should show 
‘connected to NodeJS’


4. FTP config
Enter your FTP credentials in /routes/cfg.json . You can validate the connection using http://localhost:3000/check/ftp .


5. Apache config
Given that MEP already has an Apache running, it is recommended to leverage its Reverse Proxy capabilities. A detailed instruction guide is available here
http://blog.podrezo.com/making-node-js-work-with-apache/


6. Run the server
Execute the following command to start the server with forever

‘forever start ./bin/www’


7. Reference Error messages

The error messages are based on the HTTP error codes. Find a list of the most common ones below:

	200		OK
	400		Bad request
	404		Not found
	408		Request timeout
	500		Internal server error
	502 	Bad Gateway
	503		Service unavailable
	504		Gateway timeout


