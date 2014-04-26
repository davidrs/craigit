craigit
=======

Trigger email notifications as soon as items you want show up NEAR you on craigs list.
Currently only supports Washington d.c

GitHub.io page
==============

davidrs.github.io/craigit/client/


Folder Structure
================

*Client: * contains all JS, HTML and CSS for client side.
We use Twitter Bootstrap for styling.

*Server: * contains code for storing, retreiving, and running Craig's List searches on the server.
The runAllSearches.php file needs to be setup to be triggered by a cron job on the server to run every X hours and send notifications.


Setup Local Env
===============


1. Fork the Repo.

2. Client side code should work right away.

*Optional: local server side:
Pre-Requisite: MySQL and PHP
1. on client side update main.js to use a relative path instead of pointing to my server.
2. Create an empty database locally in MySQL
2.A. Update DB_CREATION.sql to use the database name you just created.
2.B. Run the DB_CREATION.sql file to create the local server setup


Attribution
============

Logo: http://www.frog-clip-art.com/free_frog_clipart/green_frog_silhouette_0521-1101-1912-4608.html


TODO
====

- turn city selector into https://github.com/danielfarrell/bootstrap-combobox
OR do it automagically based on address typed in.
- Add a category selector: property, electronics, etc.
-Clean up ReadMe to use markdown properly