var app = angular.module('mindMateApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/tracker', {
        templateUrl: 'tracker.html',
        controller: 'TrackerController'
    })
    .when('/dashboard', {
        templateUrl: 'dashboard.html',
        controller: 'DashboardController'
    })
    .otherwise({ redirectTo: '/tracker' });
});

// Tracker Controller
app.controller('TrackerController', function($scope) {

    // Emotions with images and colors
    $scope.emotions = [
        { name: 'Happy', image: 'images/happy.png', color:'#FFEB3B', suggestion:'Keep smiling!' },
        { name: 'Sad', image: 'images/sad.png', color:'#2196F3', suggestion:'It’s okay to feel sad sometimes.' },
        { name: 'Angry', image: 'images/angry.png', color:'#F44336', suggestion:'Take a deep breath.' },
        { name: 'Excited', image: 'images/excited.png', color:'#FF9800', suggestion:'Enjoy your excitement!' },
        { name: 'Anxious', image: 'images/anxious.png', color:'#9C27B0', suggestion:'Try to relax.' }
    ];

    // Load history from localStorage
    $scope.history = JSON.parse(localStorage.getItem('emotionHistory')) || [];

    $scope.selectedEmotion = {};

    // Choose emotion
    $scope.chooseEmotion = function(emotion) {
        $scope.selectedEmotion = emotion;
        const entry = { emotion: emotion.name, date: new Date().toLocaleString() };
        $scope.history.push(entry);
        localStorage.setItem('emotionHistory', JSON.stringify($scope.history));
    };
});

// Dashboard Controller
app.controller('DashboardController', function($scope, $timeout) {

    $scope.history = JSON.parse(localStorage.getItem('emotionHistory')) || [];
    $scope.filteredHistory = angular.copy($scope.history);

    // Filter moods
    $scope.filterMood = function(mood) {
        if(mood === 'All') $scope.filteredHistory = angular.copy($scope.history);
        else $scope.filteredHistory = $scope.history.filter(e => e.emotion === mood);
        updateChart();
    };

    // Clear history
    $scope.clearHistory = function() {
        if(confirm("Are you sure you want to clear history?")) {
            $scope.history = [];
            $scope.filteredHistory = [];
            localStorage.removeItem('emotionHistory');
            updateChart();
        }
    };

    // Map emotion to color
    $scope.getColor = function(emotion) {
        switch(emotion) {
            case 'Happy': return '#FFEB3B';
            case 'Sad': return '#2196F3';
            case 'Angry': return '#F44336';
            case 'Excited': return '#FF9800';
            case 'Anxious': return '#9C27B0';
            default: return '#9E9E9E';
        }
    };

    var chart;

    function updateChart() {
        if(!$scope.history) return;

        let counts = { Happy:0, Sad:0, Angry:0, Excited:0, Anxious:0 };
        $scope.history.forEach(e => { if(counts[e.emotion] !== undefined) counts[e.emotion]++; });

        const ctx = document.getElementById('moodChart').getContext('2d');

        if(chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Happy','Sad','Angry','Excited','Anxious'],
                datasets: [{
                    label: 'Number of times selected',
                    data: [counts.Happy, counts.Sad, counts.Angry, counts.Excited, counts.Anxious],
                    backgroundColor: ['#FFEB3B','#2196F3','#F44336','#FF9800','#9C27B0']
                }]
            },
            options: {
                responsive:true,
                plugins: { legend:{ display:false } },
                scales: { y:{ beginAtZero:true, precision:0 } }
            }
        });
    }

    $scope.$watch('history', function(newVal, oldVal) {
        if(newVal) updateChart();
    }, true);

    $timeout(updateChart, 100);
});
