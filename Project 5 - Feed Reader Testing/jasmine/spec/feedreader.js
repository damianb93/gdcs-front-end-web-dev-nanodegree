/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
   /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* Test checks if all RSS feed objects have url property
         * and checks if its value is not empty.
         */
        it('have url defined and not empty', () => {
            allFeeds.forEach(e => {
                expect(e.url).toBeDefined();
                expect(e.url).not.toBe('');
            })
        })

        /* Test checks if all RSS feed objects have name property
         * and checks if its value is not empty.
         */
        it('have name defined and not empty', () => {
            allFeeds.forEach(e => {
                expect(e.name).toBeDefined();
                expect(e.name).not.toBe('');
            })
        })
    });

    describe('The menu', () => {

         /* Tests checks if menu is hidden by default on application
          * startup.
          */
        it('is hidden by default', () => {
            expect($('body').context.body.classList.contains('menu-hidden')).toBe(true);
        });

        // Test checks if menu toggling is working properly
         it('toggles on icon click', () => {
            const menuIcon = $('.menu-icon-link');
            const initialState = $('body').context.body.classList.contains('menu-hidden');

            menuIcon.click();
            expect($('body').context.body.classList.contains('menu-hidden')).toBe(!initialState);

            menuIcon.click();
            expect($('body').context.body.classList.contains('menu-hidden')).toBe(initialState);
         })
    })

    describe('Initial Entries', () => {

        /* Invokes async loadFeed function to load page content 
         * and finishes it before tests.
         */
        beforeEach((done) => {
            loadFeed(0, () => {
                done();
            });
        })

        /* Test chekcs if there's at least one entry element on page
         * after page load
         */
        it('are not empty', () => {
            expect($('.feed a.entry-link').length).toBeGreaterThan(0);
        });
    });

    describe('New Feed Selection', () => {
        let firstChildLink;
        let firstChildLinkChanged;
        

        /* Pre test initialization method which calls async methods
         * one after another. Href property of first child object is assigned
         * to variables for each of the methods.
         */
        beforeEach((done) => {
            loadFeed(0, () => {
                firstChildLink = $('.feed')['0'].children[0].href;
                loadFeed(1, () => {
                    firstChildLinkChanged = $('.feed')['0'].children[0].href;
                    done();
                });
            });
        });

        /* Test checks if content changes after change of the feed.
         * It tests equality of href properties assigned in beforeEach method.
         */
        it('changes content', () => {
            expect(firstChildLink).not.toEqual(firstChildLinkChanged);
        })
    });
}());
