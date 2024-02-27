### Instructions

Node v18 is recommended. Also make sure you have node-ts installed globally

- npm install
- docker-compose up -d
- npx prisma migrate dev (This will create the DB tables and run the seeds)
- npx nx serve backend (run in a separate terminal for Nest.js)
- npx ns serve frontend (run in a separate terminal for React.js)

### Possible Improvements

- Adding tests
- Improving Front-end design
- Using useForm for forms
- Better input handling on the front-end
