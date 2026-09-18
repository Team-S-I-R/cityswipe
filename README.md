# CitySwipe

CitySwipe is a web app that helps users find their perfect vacation destination by matching them with vacation spots based on their preferences. The app aims to provide a fun, engaging, and personalized experience for users while learning about new places and cultures. Check us out!

## Local development

Use Node.js 22.12 or newer and pnpm 11.7.0. Run these commands from the repository root:

```sh
cp cityswipe-fe/.env.sample cityswipe-fe/.env # only if you do not already have .env
pnpm install
pnpm run dev
```

Open http://localhost:3000. To build and run the production app:

```sh
pnpm run build
pnpm run start
```

The same commands also work inside `cityswipe-fe`. `pnpm run lint` checks the source. `pnpm test` runs the regression checks without accessing live services.
Dependency installation generates the Prisma client. Fonts and default destination images are bundled locally.

Configure `cityswipe-fe/.env` before starting:

- **Authentication:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from the same Clerk application. Sign-in and sign-up routes default to `/sign-in` and `/sign-up`.
- **Storage:** `DATABASE_URL` for PostgreSQL. The database must contain the tables in `cityswipe-fe/prisma/schema.prisma`. For a new, empty development database, run `pnpm --dir cityswipe-fe exec prisma db push`. Set `DIRECT_URL` if schema commands need a direct connection instead of a pooler.
- **Destination suggestions and chat:** `GOOGLE_GENERATIVE_AI_API_KEY`. `GEMINI_MODEL` is optional and defaults to `models/gemini-flash-latest`.
- **Destination photos:** `PEXELS_API_KEY` is optional; a bundled image is used when photos cannot be fetched.
- **Subscriptions:** set `STRIPE_SECRET_KEY`, `STRIPE_M_PLAN`, `STRIPE_Y_PLAN`, and `STRIPE_WEBHOOK_SECRET`. Set `APP_URL` to the origin used for checkout redirects (defaults to `http://localhost:3000`). Configure Stripe to deliver checkout, invoice, and subscription events to `/pricing/webhook`. Paid plans are disabled while billing is unconfigured.
- **Optional search endpoints:** flight search needs `AMADEUS_API_KEY` and `AMADEUS_API_SECRET`; hotel search needs `RAPID_API_KEY`. Unconfigured services return HTTP 503. Supply future dates and valid search parameters; invalid requests return HTTP 400.

Authentication keys are needed for page rendering. A reachable database and a Google AI key are needed for the signed-in quiz, saved matches, chat, and itinerary flows. Building does not query the database or call travel or billing providers.

Never commit `.env` or put private provider keys in client components.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building server-side rendered and statically generated web apps.
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework for building modern websites.
- [Pexels API](https://www.pexels.com/api/) - API for accessing high-quality images for vacation spots.
- [Gemini API](https://www.gemini.com/api) - LLM API used for matching users with vacation spots.
- [Shad CN UI](https://github.com/shadcn-ui/ui) - UI components built with Radix UI and Tailwind CSS.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [Stripe](https://docs.stripe.com/api) - API for setting up payments.
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript.

## Features

- User authentication and profile management
- Interactive quiz to determine user preferences
- Destination matching based on user preferences
- Explore page for browsing vacation spots
- Itinerary planning
- Subscription-based premium features
- Flight search functionality

## Founders

- Shaurya Bisht
- [Portfolio](https://personal-site-psi-umber.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/shaurya-bisht-6857732b1/)
- [GitHub](https://github.com/ssbdragonfly)
  - Email: bishtshaurya314@gmail.com

- Itwela Ibomu
- [Portfolio](https://www.itwela.dev/)
- [LinkedIn](https://www.linkedin.com/in/itwela/)
- [GitHub](https://github.com/itwela)

- Rehan Nagoor Mohideen
- [Portfolio](https://www.rehanmohideen.com/)
- [LinkedIn](https://www.linkedin.com/in/rehan-nagoor-mohideen-6b3156202/)
- [GitHub](https://github.com/rehan-code/rehan-code)

## Contributing

Please read [CONTRIBUTING.md](./rdocs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Prosperity Public License 3.0.0 - see the [LICENSE.md](./LICENSE.md) file for details.