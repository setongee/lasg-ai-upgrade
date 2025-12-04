export const navigationRoutes = {

    route1 : {
        parentName : "Government",
        theme : "#f9f9f9",
        isNest : true,
        index : 1,
        url : '/government',
        nests : {
            heading : 'Explore the Lagos State Government, Officials and Parastatals.',
            vector : '#',
            links : [ 

                {
                    name : 'Elected Officials',
                    desc : 'View all the officers elected by lagosians this tenure.',
                    url : 'government/elected_officials',
                    external : false
                },
                
                {
                    name : 'Explore Ministries and Departments',
                    desc : 'Explore Lagos State Ministries, Departments and Agencies',
                    url : 'government/mdas',
                    external : false
                },
                {
                    name : 'Legislative Officers',
                    desc : 'View all the Legitlative Officers elected by lagosians this tenure.',
                    url : 'https://www.lagoshouseofassembly.gov.ng/4388-2/',
                    external : true
                },
                {
                    name : 'Judiciary Officers',
                    desc : 'View all the Judiciary Officers appointed for this tenure.',
                    url : 'https://lagosjudiciary.gov.ng/directories.html#directories',
                    external : true
                }


            ]
        }
    },

    route2 : {
        parentName : "Services",
        theme : "#f9f9f9",
        isNest : false,
        index : 2,
        url : '/services'
    },

    route3 : {
        parentName : "News & Events",
        theme : "#f9f9f9",
        isNest : false,
        index : 3,
        url : '/news/trending'
    },

    route4 : {
        parentName : "Connect",
        theme : "#f9f9f9",
        isNest : false,
        index : 4,
        url : '/connect'
    },

    route5 : {
        parentName : "",
        theme : "#f9f9f9",
        isNest : false,
        type : "search",
        index : 5,
        url : '/search'
    }
}