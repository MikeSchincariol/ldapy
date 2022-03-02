# ldapy
A web app to query an LDAP server for details of a username

Yes...I know...there are likely other apps that already do this :) But I wanted the challenge of making my own!

This app consists of an HTML/Javascript frontend and a Python/Flask backend for performing the query. An Apache web server is required to bridge between HTTP and WSGI (required by Python/Flask). Of course, any HTTP server will do, but, the project provides configuration files for Apache.

Use install.sh to copy the files to their proper locations and to setup the Python virtual environment.

The installer is not super smart (yet) so you will have to scan the files and replace the string, {--CHANGE ME--} with the appropriate values. You will also have to setup the strings in config.py to match your LDAP server.

Ldapy runs on port 2080 by default, but, you can change that to what ever you want by modifying the Apache virtual host configuration.
