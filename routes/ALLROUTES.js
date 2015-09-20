// ALL ROUTES
/*
What are all the routes for this app, where do they go, and what are the various permissions?

ROUTES FOR GENERAL INFORMATION          PURPOSE; REDIRECTS OR VIEWS WITH LINKS

Navbar links (all GET)                  Welcome, Activities, Badges, Login, Register

/Welcome GET                            Render Welcome.jade, a beautiful welcome page for those interested in stemArtisans
/Register GET                           Render Register.jade, registration page form; submit to /Register POST
/Register POST                          User model save to db; redirect /Dashboard
/Login GET                              Render Login.jade, login page form; submit to /Login POST
/Login POST                             User model, password compare; redirect /Dashboard

/Activities GET                         gA, render Alist.jade, list of activities; search; /Activities/select, /Activities/:activityid GET
/Activities/new GET                     Render form to add details of a new activity; submit to /Activities POST
/Activities POST                        giA; redirect /Activities/:activityid GET
/Activities/:activityid GET             gA; Render ActivityDetail.jade, view with activity details; /Activities/select
/Activities/:activityid/edit GET        gA; Render ActivityEdit.jade; submit to /Activities/:activityid PUT
/Activities/:activityid PUT             uA; redirect to /Activities/:activityid GET
/Pathways                               ...
/Courses                                ...
/Modules                                ...

/Badges GET                             Render welcome page, Badges.jade, to explain available badges from stemArtisans; link to /Badges/blist
/Badges/blist GET                       Render list.jade, list of all available badges; link to /Badges/betail
/Badges/bdetail GET                     Render detail.jade, with detailed criteria for specific badge

ROUTES FOR STUDENTS

/Dashboard                              gUpA or gU, gA; Render dashboard.jade; List all activities; links to /Dashboard/:activityid
/Dashboard/:activityid                  gU; Activity model findOne; Render dashboard2.jade, user detail of current activity, including notes and comments (allows notes)
/Dashboard/select POST                  aiU; redirect /Dashboard


/Dashboard/:userid                      Render dashboard.jade (do not allow posting of notes); Links to /Dashboard/:userid/:activityid
/Dashboard/:userid/:activityid          Render dashboard2.jade with activity details, including associated notes; /:pid/comments/new GET

/Note/:id GET                           gNpC; Render note.jade to show individual note; Links to new GET, PUT and DELETE (IF USER ONLY)
/Note/:id POST                          aN; Redirect to /Dashboard/:activityid
/Note/new GET                           Render NoteNew.jade; Submit to /Note/:id POST
/Note/:id/edit GET                      gN; Render NoteEdit.jade; Submit to /Note/:id/edit PUT
/Note/:id PUT                           uN; Redirect to /Dashboard/:activityid
/Note/:id DELETE                        dN; Redirect to /Dashboard/:activityid

/:nid/comments GET                      gNpC; Render comments.jade to list comments together with note; Link to /:nid/comments/new GET; 
/:nid/comments/new GET                  Render commentnew.jade; Submit to /:nid/comments POST
/:nid/comments/:id/edit GET             gC; Render commentedit.jade with form; Submit to /:nid/comments PUT
/:nid/comments/:id PUT                  uC; Redirect to /Note/:id
/:nid/comments/:id DELETE               dC; Redirect to /Note/:id
/:nid/comments POST                     aC, gC, cN; Redirect to /Note/:id


ROUTES FOR TEACHERS/MENTORS

/mentor/dash GET                        Render mentordash.jade showing main page for teacher
/comments GET
/comments/:tag GET
/comments/:user GET

DATA ACCESS AND OTHER FUNCTIONS         SYMBOL

addUserActivity                         aiU     Push activity ObjectId to user activities array
getUserPopActivities                    gUpA    Get user and populate activities
getUser                                 gU
getActivity                             gA
updateActivity                          uA

addNote (note)                          aN
getNotesPopComments                     gNpC    Get note and populate comments
getNotesByTag                           gNt
deleteNote                              dN
updateNote                              uN
addComment                              aC
commentNote                             cN      Push comment id to comments array in Note document
getComment                              gC
deleteComment                           dC
updateComment                           uC



*/

