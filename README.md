# Fancy Movie Database

Like the other one, but _fancy_.

Used as a demo project to show off [the Convex migrations component](https://www.convex.dev/components/migrations).

Video walkthrough of this project: https://youtu.be/hj89hIjq2HE

## Getting It Running

```console
$ npm i
$ npm run dev
```

Then, in a second terminal window, load the movie database into your Convex deployment:
```console
$ npx convex import load/snapshot.zip
```

Finally, you should be able to load `http://localhost:3000/` in your web browser
to visit the app.
