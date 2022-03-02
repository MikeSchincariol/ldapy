#!/usr/bin/env python3
from flask import Flask, escape

import ldap3
import json

import config

app = Flask(__name__)


@app.route("/")
def idx():   
    html = f'''<!DOCTYPE html>
               <html lang="en">
                 <head>
                   <meta charset="UTF-8">
                   <meta itemprop="backend_url" content={config.BACKEND_URL}>
                   <title>Ldapy</title>
                   <link href="static/app.css" rel="stylesheet">    
                   <link rel="shortcut icon" type="image/jpeg" href="static/favicon.jpg">
                   <link rel="preconnect" href="https://fonts.googleapis.com">
                   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                   <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;400&family=Roboto:wght@100;400&family=Source+Code+Pro:wght@300;400&family=Source+Sans+3:wght@300;400&display=swap" rel="stylesheet">
                   <script src="scripts/app.js" defer></script>
                 </head>
                 <body>
                   <main>
                     <div class=root/>
                     "Loading Ldapy..."
                   </main>
                 </body>
               </html>'''
    return html


@app.route("/user/<username>")
def get_ldap_details_of_username(username):    
    server = ldap3.Server(config.LDAP_URL)
    conn = ldap3.Connection(server,
                            config.BIND_DN,
                            config.BIND_PASS,
                            auto_bind = True)
    conn.search(config.SEARCH_BASE,
                f"(&(sn=*)(objectclass=Person)(sAMAccountName={escape(username)}))",
                attributes=["cn", "sn", "sAMAccountName", "mail", "title", "manager", "givenName", "displayName", "memberof", "telephonenumber", "department", "objectCategory", "objectclass", "objectGUID"])
    return conn.entries[0].entry_to_json()



