var app = angular.module('mindMateApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/register', {
        templateUrl: 'register.html',
        controller: 'AuthController'
    })
    .when('/login', {
        templateUrl: 'login.html',
        controller: 'AuthController'
    })
    .when('/tracker', {
        templateUrl: 'tracker.html',
        controller: 'TrackerController'
    })
    .when('/dashboard', {
        templateUrl: 'dashboard.html',
        controller: 'DashboardController'
    })
    .otherwise({ redirectTo: '/register' });
});

// Authentication Controller
app.controller('AuthController', function($scope, $location) {
    $scope.user = {};

    // Registration
    $scope.register = function() {
        if(!$scope.user.email || !$scope.user.password){
            alert("Please enter both email and password.");
            return;
        }
        localStorage.setItem('mindMateUser', JSON.stringify($scope.user));
        alert("Registration successful!");
        $location.path('/tracker');
    };

    // Login
    $scope.login = function() {
        var savedUser = JSON.parse(localStorage.getItem('mindMateUser'));
        if(savedUser && $scope.user.email === savedUser.email && $scope.user.password === savedUser.password){
            $location.path('/tracker');
        } else {
            alert("Invalid email or password.");
        }
    };
});

// Tracker Controller
app.controller('TrackerController', function($scope) {
    $scope.emotions = [
        { name: 'Happy', image: 'images/happy.png', color:'#FFEB3B', suggestion:'Keep smiling!' },
        { name: 'Sad', image: 'images/sad.png', color:'#2196F3', suggestion:'It’s okay to feel sad sometimes.' },
        { name: 'Angry', image: 'images/angry.png', color:'#F44336', suggestion:'Take a deep breath.' },
        { name: 'Excited', image: 'images/excited.png', color:'#FF9800', suggestion:'Enjoy your excitement!' },
        { name: 'Anxious', image: 'images/anxious.png', color:'#9C27B0', suggestion:'Try to relax.' }
    ];

    $scope.history = JSON.parse(localStorage.getItem('emotionHistory')) || [];
    $scope.selectedEmotion = null;

    $scope.chooseEmotion = function(emotion) {
        $scope.selectedEmotion = emotion;
        const entry = { emotion: emotion.name, date: new Date().toLocaleString() };
        $scope.history.push(entry);
        localStorage.setItem('emotionHistory', JSON.stringify($scope.history));
    };
});

// Dashboard Controller
app.controller('DashboardController', function($scope) {
    $scope.history = JSON.parse(localStorage.getItem('emotionHistory')) || [];
    $scope.filteredHistory = angular.copy($scope.history);

    $scope.filterMood = function(mood) {
        if(mood === 'All') $scope.filteredHistory = angular.copy($scope.history);
        else $scope.filteredHistory = $scope.history.filter(e => e.emotion === mood);
    };
});
