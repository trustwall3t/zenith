# Zenith MySQL dump (local only)

Put your **Zenith Growth** database export here:

```text
data/zenith-mysql.sql
```

- Export from phpMyAdmin (**Export** → SQL) or `mysqldump`
- Do **not** commit this file (ignored by git)
- Then run from project root:

```bash
npm run import:zenith-sql
```

Or with a custom path:

```bash
npm run import:zenith-sql -- ~/Downloads/u228053773_phantom.sql
```

If Namecheap import fails with row-size errors, patch first using Zenith’s  
`zenithgrowth/database/patch-sql-namecheap.sh` on the dump, then import the `.namecheap.sql` file.
