import sqlite3

conn = sqlite3.connect('whatsapp-automation/whatsapp_automation.db')
c = conn.cursor()
cols = [r[1] for r in c.execute('PRAGMA table_info(messages)').fetchall()]
print('Existing messages cols:', cols)
if 'category' not in cols:
    print('Adding category column to messages...')
    c.execute("ALTER TABLE messages ADD COLUMN category VARCHAR(32) DEFAULT 'GENERAL'")
    conn.commit()
    print('Added category successfully!')
else:
    print('category column already exists.')
conn.close()
