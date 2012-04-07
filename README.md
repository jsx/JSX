INSTALLATION
=======================

Install development tools by the following command:

    npm install .

TESTING
=======================

For server side tests, just type the following command:

    make test

WEB INTERFACE
=======================

Currently the web interface is written in Perl.
Installs `lib::xi` and `Plack` by cpanm, and then type the following comand:

    plackup web/app.psgi


