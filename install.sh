#!/bin/bash
rm -rf ./venv
virtualenv -v --clear venv
python3 -m venv ./venv
cp pip.conf ./venv/pip.conf
source ./venv/bin/activate
pip3 install -r requirements.txt

# If a config.py file does not exist, copy the template over as
# a starting point
if [ ! -f ./config.py ]; then
    echo "No config.py file found. Creating empty one from template."
    echo "Be sure to fill in the variables inside the config.py file."
    cp ./templates/config.template ./config.py
fi

# Configure the Apache web server
echo ""
echo ""
echo "Configuring Apache..."
sudo a2enmod rewrite
sudo cp ./apache2-conf/conf-available/ldapy-backend.conf /etc/apache2/conf-available
sudo cp ./apache2-conf/sites-available/ldapy-backend.conf /etc/apache2/sites-available
sudo a2ensite ldapy-backend
# NOTE: No need to use a2enconf because the Apahce site definition #includes the athena-backend.conf file.

echo ""
echo ""
echo "Reloading Apache Config..."
sudo systemctl reload apache2.service

