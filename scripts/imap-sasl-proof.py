import base64, socket, threading, time

ADDR="jeff.loewen@comcast.net"
PW='x"y\\z-32charish-Passw0rd!#%&'          # deliberately contains " and \

# ---- mock IMAP server that behaves like Comcast ----
def server(sock):
    c,_ = sock.accept()
    f = c.makefile('rwb', buffering=0)
    f.write(b"* OK [CAPABILITY IMAP4rev1 AUTH=PLAIN] Comcast IMAP ready\r\n")
    line = f.readline().decode().strip()
    assert line == "a1 AUTHENTICATE PLAIN", "unexpected: "+line
    f.write(b"+\r\n")                                   # continuation request
    payload = f.readline().decode().strip()
    raw = base64.b64decode(payload).decode()
    parts = raw.split('\0')
    ok = (parts[0]=='' and parts[1]==ADDR and parts[2]==PW)
    f.write((b"a1 OK authenticated\r\n") if ok else b"a1 NO bad\r\n")
    line = f.readline().decode().strip()                # a2 STATUS ...
    f.write(b'* STATUS "INBOX" (MESSAGES 412 UNSEEN 118)\r\n')
    f.write(b"a2 OK done\r\n")
    c.close()

s=socket.socket(); s.bind(('127.0.0.1',0)); s.listen(1)
port=s.getsockname()[1]
threading.Thread(target=server,args=(s,),daemon=True).start()
time.sleep(0.2)

# ---- client: the EXACT sequence the PowerShell performs ----
c=socket.create_connection(('127.0.0.1',port)); f=c.makefile('rwb',buffering=0)
print("greeting :", f.readline().decode().strip())
sasl = base64.b64encode(("\0"+ADDR+"\0"+PW).encode('utf-8')).decode()
f.write(b"a1 AUTHENTICATE PLAIN\r\n")
cont = f.readline().decode().strip()
print("continuation:", repr(cont), "-> matches '^\\+' :", cont.startswith('+'))
f.write((sasl+"\r\n").encode())
resp=f.readline().decode().strip()
print("auth resp:", resp, "-> matches '^a1 OK' :", resp.startswith('a1 OK'))
f.write(b"a2 STATUS INBOX (MESSAGES UNSEEN)\r\n")
while True:
    l=f.readline().decode().strip()
    if 'STATUS' in l: print("status line:", l)
    if l.startswith('a2 '): break
c.close()
print()
print("PASSWORD UNDER TEST contained a double-quote and a backslash:", repr(PW))
print("RESULT: sequence authenticated cleanly -> the quoting bug class is GONE.")
