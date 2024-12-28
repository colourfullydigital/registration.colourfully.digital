// Third-party packages
const express = require( "express" );
const session = require( "express-session" );
const expressLayouts = require( "express-ejs-layouts" );
const ejs = require( "ejs" );
const MarkdownIt = require( "markdown-it" );
const fs = require( "fs" );

// Database
const pool = require( "./db" );

// Routes
const { auth, logOut } = require( "./routes/authentication" );
const landing = require( "./routes/landingPage" );
const accountRoute = require( "./routes/accountRoute" );
const dependents = require( "./routes/dependentsRoute" );
const programs = require( "./routes/programsRoute" );

const config = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || "fallback-secret-dev-only",
  url: process.env.URL || "http://localhost"
};

const app = express();

const path = require( "path" );
const md = new MarkdownIt();

app.set( "view engine", "ejs" );

const memoStore = new session.MemoryStore();
app.use(
  session( {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoStore,
    cookie: { secure: false, sameSite: "lax", maxAge: 1000 * 60 * 30 },
  } )
);

app.use( express.urlencoded( { extended: true } ) );
app.use( express.static( "public" ) ); // 'public' is the folder containing your css, js and other static files
app.use( expressLayouts );
app.set( "layout", "layouts/default" );

const routes = {
  auth: [
    { path: '/sign_in', handler: auth },
    { path: '/sign_out', handler: logOut },
    { path: '/sign_up', handler: accountRoute }
  ],
  features: [
    { path: '/dependents', handler: dependents },
    { path: '/programs', handler: programs }
  ],
  core: [
    { path: '/', handler: landing }
  ]
};

Object.values( routes ).flat().forEach( route => {
  app.use( route.path, route.handler );
});

// After all routes
app.use( ( err, req, res, next ) => {
  console.error( err.stack );
  res.status( 500 ).render( "error", { 
    error: process.env.NODE_ENV === "development" ? err : "Internal Server Error"
  });
});

// 404 handler
app.use(( req, res ) => {
  res.status( 404 ).render( "404" );
});

app.listen(config.port, () => {
  console.log( `Server is running on ${ config.url }:${ config.port }`);
});

const generateStaticSite = () => {
  const pages = [
    { 
      template: "pages/index", 
      output: "index.html", 
      data: { 
        title: "Home",
        description: "Welcome to STEM Education Portal - Empowering youth through technology education"
      } 
    },
    { 
      template: "pages/about", 
      output: "about/index.html", 
      data: { 
        title: "About",
        description: "Learn about our mission to make STEM education accessible to all"
      } 
    },
    { 
      template: "pages/contact", 
      output: "contact/index.html", 
      data: { 
        title: "Contact",
        description: "Contact us for questions, comments or concerns."
      } 
    }

  ];

  pages.forEach( page => {
    // First render the content with EJS
    ejs.renderFile(
      path.join( __dirname, `views/${ page.template }.ejs` ), 
      { ...page.data, first_name: undefined },
      { async: false },
      ( err, content ) => {
        if ( err ) {
          console.error( `Error rendering ${ page.template }:`, err );
          return;
        }

        // Then render the layout with the content
        ejs.renderFile(
          path.join( __dirname, 'views/layouts/default.ejs' ),
          { 
            ...page.data, 
            body: content,
            first_name: undefined
          },
          { async: false },
          ( layoutErr, html ) => {
            if ( layoutErr ) {
              console.error( `Error rendering layout for ${page.template }:`, layoutErr );
              return;
            }

            const outputPath = path.join( __dirname, "public", page.output );
            const outputDir = path.dirname( outputPath );
            
            if ( !fs.existsSync( outputDir ) ) {
              fs.mkdirSync( outputDir, { recursive: true } );
            }

            fs.writeFileSync( outputPath, html );
            console.log( `Generated ${ outputPath }` );
          }
        );
      }
    );
  });
};

generateStaticSite();