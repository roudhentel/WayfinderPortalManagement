var mainApp = angular.module("mainApp", ["ui.router", "ngMaterial"]);

mainApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    //$httpProvider.defaults.cache = true;

    $urlRouterProvider.otherwise("/home/dashboard");

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'contents/home/',
            controller: 'homeCtrl'
        })
        .state('home.dashboard', {
            url: '/dashboard',
            templateUrl: 'contents/dashboard/',
            controller: 'dashboardCtrl',
            params: {
                isfav: null
            }
        })
        .state('home.favorites', {
            url: '/favorites',
            templateUrl: 'contents/dashboard/',
            controller: 'dashboardCtrl',
            params: {
                isfav: null
            }

        })
        .state('home.stores', {
            url: '/stores',
            templateUrl: 'contents/stores/',
            params: {
                reloadData: null
            },
            controller: 'storesCtrl'
        })
        .state('home.store', {
            url: '/store/:store',
            templateUrl: 'contents/store/',
            controller: 'storeCtrl',
            params: {
                store: null,
                from: null
            }
        })
        .state('home.store.data', {
            url: '/data',
            templateUrl: 'contents/store.data/',
            controller: 'storeDataCtrl'
        })
        .state('home.store.analytics', {
            url: '/analytics',
            templateUrl: 'contents/analytics/',
            controller: 'analyticsCtrl'
        })
        .state('main', {
            url: '/main',
            templateUrl: 'contents/main/',
            controller: 'mainPageCtrl'
        })
        .state('main.login', {
            url: '/login',
            templateUrl: 'contents/login/',
            controller: 'loginCtrl'
        })
        .state('main.register', {
            url: '/register',
            templateUrl: 'contents/register/',
            controller: 'registerCtrl'
        });


    $locationProvider.html5Mode(true);
});