# CompetenceHub learner frontend

A responsive learner dashboard and a set of interactive practice pages built
with Next.js and React.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run build` to
create a production build and `npm run start` to serve it.

## Deploy to Netlify

The Netlify configuration is in `docs/netlify.toml`. Configure the Netlify site
to use `docs` as its base directory and `docs/netlify.toml` as its config file.
The config builds the Next.js app with the Netlify Next.js plugin.

Set `NEXT_PUBLIC_API_URL` in the Netlify site's environment variables to the
deployed API base URL, including `/api/v1`, and configure the backend to allow
the Netlify site's origin in its production CORS settings.

## Pages

- `/` — sends visitors to the sign-in page, in both local development and production.
- `/dashboard` — learner dashboard with Overview, My learning, Past Papers, My progress,
  and Study planner sections. The planner, dashboard tab, and grade/subject selection
  are saved in browser storage.
- `/login` — learner sign-in interface.
- `/signup` — learner account creation interface.
- `/forgot-password` — phone-based password reset interface.
- `/admin` — admin sign-in and dashboard for past-paper uploads and registered accounts.
- `/learn/[grade]/[subject]` — starter practice preview for the selected grade and subject.
- `/past-papers/[grade]/[subject]` — available past-paper PDFs for the selected grade and subject, with download links.
- `/demo/math-numbers` — standalone mathematics demo practice.
- `/demo/science-matter` — standalone science demo practice.
- `/demo/english-reading` — standalone English demo practice.

## Python authentication backend

The login and sign-up pages submit to the FastAPI service. Set
`NEXT_PUBLIC_API_URL` in `docs/.env.local` to the API base URL (for local
development, `http://localhost:8000/api/v1`). The browser sends requests with
credentials enabled so the API can set its HTTP-only session cookie. The API
always allows the two local frontend origins `http://localhost:3000` and
`http://127.0.0.1:3000`, even when `CORS_ORIGINS` is overridden for production.

Create a virtual environment and install the backend requirements:

```powershell
Set-Location .\backend
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Run the setup commands from the project root (`C:\LEARNING.COMPETENCEHUB.CO.KE`).
The existing local `backend/.env` was moved unchanged. The API currently
uses `BB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and
`DB_PASSWORD` for PostgreSQL, along with `AUTH_SECRET_KEY`. Keep `.env` private
and do not send credentials in chat. A matching template is provided at
`backend/.env.example`.

Apply the initial schema to the target PostgreSQL database using a PostgreSQL
client or the NovaHost SQL console. From the project root, `psql` can use the
same connection fields as the API:

```powershell
psql -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USERNAME -d $env:DB_DATABASE -v ON_ERROR_STOP=1 -f .\backend\migrations\001_initial_auth_schema.sql
```

`psql` prompts for the database password. PowerShell does not automatically
load `backend/.env`; set these `DB_*` variables in the terminal first, or run
the migration from the NovaHost SQL console. After the initial schema is
installed, apply the question-generation usage migration as well:

```powershell
psql -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USERNAME -d $env:DB_DATABASE -v ON_ERROR_STOP=1 -f .\backend\migrations\002_question_generation_usage.sql
```

After migrations 001 and 002, also apply
`backend/migrations/003_learner_practice_activity.sql` and
`backend/migrations/004_admin_and_past_papers.sql`. After 004, apply
`backend/migrations/005_cloudinary_documents.sql` and
`backend/migrations/006_cloudinary_only_documents.sql` to make Cloudinary the
only document-file storage. Migration 006 drops the unused database binary
column and requires Cloudinary references for each paper record. Run these
from the project root after setting the PostgreSQL connection variables:

```powershell
psql -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USERNAME -d $env:DB_DATABASE -v ON_ERROR_STOP=1 -f .\backend\migrations\003_learner_practice_activity.sql
psql -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USERNAME -d $env:DB_DATABASE -v ON_ERROR_STOP=1 -f .\backend\migrations\004_admin_and_past_papers.sql
psql -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USERNAME -d $env:DB_DATABASE -v ON_ERROR_STOP=1 -f .\backend\migrations\005_cloudinary_documents.sql
psql -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USERNAME -d $env:DB_DATABASE -v ON_ERROR_STOP=1 -f .\backend\migrations\006_cloudinary_only_documents.sql
```

To seed or reset the admin account, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in
`backend/.env` (use a unique password of at least 12 characters), then run:

```powershell
Set-Location .\backend
.\.venv\Scripts\Activate.ps1
python -m app.seed_admin
```

The seed command creates the account if it does not exist and updates its
password if it does. Admin credentials are never hard-coded in the repository.
Open `/admin` in the frontend to sign in. Configure `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `backend/.env`. The admin
dashboard accepts PDF, DOC, and DOCX files up to 20 MB; each upload is stored
in Cloudinary and assigned the current UTC year automatically. The database
stores document metadata and Cloudinary references, while older files already
stored in PostgreSQL remain downloadable. The dashboard can manage uploaded
documents and view registered guardian accounts and learner profiles.

Start the API from the project root:

```powershell
Set-Location .\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

`CORS_ORIGINS` configures additional deployed frontend origins. Restart the API
after changing its CORS configuration.

### Production deployment on Render

No `ENV=production` setting is required; the API does not use an environment
mode variable. In the Render backend service, set the required database
variables from `backend/.env.example`, a unique `AUTH_SECRET_KEY`, and:

- `AUTH_COOKIE_SECURE=true`
- `AUTH_COOKIE_SAMESITE=none`
- `AUTH_COOKIE_DOMAIN` unset
- `CORS_ORIGINS` to the exact HTTPS origin of the deployed frontend, without a
  trailing slash (for example, `https://learning.competencehub.co.ke`). Include
  any Netlify URL that users will actually visit, comma-separated.

In the Netlify frontend service, set
`NEXT_PUBLIC_API_URL=https://learning-competencehub.onrender.com/api/v1` and
redeploy the frontend. The API origin and frontend origin must match these
settings for sign-in cookies to work. Set optional integrations such as Gemini,
SMS, and Cloudinary only if those features are needed. Apply all required
PostgreSQL migrations before using the service.

From the backend directory, run the unit tests with:

```powershell
python -m unittest discover -s tests -v
```

The health check is at `/api/v1/health`; auth routes are under
`/api/v1/auth` (`signup`, `login`, `me`, `logout`, and password reset
request/confirm). Guardian accounts use a Kenyan mobile number and password;
learner names are stored as profiles. The learner dashboard is not yet
protected by authentication; the Gemini question-generation endpoint does
require a signed-in account.

Password reset sends a 6-digit code through TalkSasa. Configure
`SMS_PROVIDER=talksasa`, `TALKSASA_API_KEY`, and optionally
`TALKSASA_SENDER_ID` and `TALKSASA_BASE_URL` in the backend environment.
Codes expire after 10 minutes, and the reset code is only stored if TalkSasa
accepts the SMS request. Keep provider credentials on the backend.
Account forms should be used only with a configured backend and database.

Grade and subject selections are available inside the learner dashboard and
saved in browser local storage for this pre-login preview. Grade and subject
selections are based on the curriculum groups provided.
The dashboard is not account-protected yet; add server-side authorization
before exposing learner-specific data.
Progress remains an honest empty state until lesson activity and grading are
connected. The Study planner stores preferred study days locally and does not
claim they are completed study sessions.
Grade-and-subject practice pages for Grades 7–9 provide two grade-specific
questions plus eight questions shared across junior grades (ten total for each
grade and subject), with answer explanations. These are
practice materials, not official past-paper questions; the answer key is
evaluated in the browser and is not submitted to a server. Their subject scope
follows the junior-school curriculum materials published by the
[Kenya Institute of Curriculum Development](https://kicd.ac.ke/cbc-materials/).
Other grade bands still show one illustrative, ungraded sample question.
Before using the junior questions for formal assessment, have a subject teacher
review them against the applicable KICD curriculum design.
Signed-in junior learners can request five more practice questions at a time
from Gemini. Generation is limited to ten questions per account per UTC day;
the backend stores daily usage per learner, remembers generated questions, and
tracks each learner's completed bank questions and answers by subject. When a
learner completes all ten bank questions, returning to that subject offers
their unanswered generated questions or the option to generate more instead
of repeating the bank. The selected learner profile is remembered in that
browser; accounts with multiple profiles must choose which learner is
practising. The Gemini key stays private in the backend environment.

Apply `backend/migrations/002_question_generation_usage.sql` and then
`backend/migrations/003_learner_practice_activity.sql` to the PostgreSQL
database before using generation or saved practice progress.
Administrators can upload past-paper PDFs and Word documents from `/admin`.
Uploaded papers are listed by grade and subject in the learner Past Papers
dashboard and downloaded from Cloudinary through the API.
Only document metadata and Cloudinary references are stored in PostgreSQL; file
bytes are stored in Cloudinary. Uploads are kept unmodified. Browser-side PDF
rewriting can reduce document quality or remove selectable text, and DOCX
files are already compressed ZIP packages, so the frontend does not recompress
these documents.
