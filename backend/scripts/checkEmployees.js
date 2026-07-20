const mongoose = require('mongoose');

function resolvedMongoUri() {
  const uri = (process.env.MONGODB_URI || '').trim();
  if (!uri) return 'mongodb://127.0.0.1:27017/hrms-simbiotik';
  const [base, query = ''] = uri.split('?');
  if (/\/[^/?#]+$/.test(base)) return uri;
  const suffix = query ? `/hrms-simbiotik?${query}` : '/hrms-simbiotik';
  return `${base.replace(/\/$/, '')}${suffix}`;
}

async function run() {
  const uri = resolvedMongoUri();
  console.log('Connecting to MongoDB at', uri);
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection.db;
  const colNames = await db.listCollections().toArray();
  console.log('Collections:', colNames.map(c => c.name).join(', '));
  const col = db.collection('employees');
  const count = await col.countDocuments();
  console.log('employees collection count:', count);
  const docs = await col.find({}, { projection: { _id: 1, name: 1, employeeId: 1, officeMail: 1, status: 1 } }).toArray();
  console.log('Sample documents:');
  docs.slice(0, 50).forEach(d => console.log(d));
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
