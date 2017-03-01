const zoomInModal = ($uibModal) => {
    return {
        restrict: 'E',
        scope: {
            thumbnail: "@",
            image: "@",
        },
        link: (scope) => {
            scope.zoomThumbnail = ($event) => {
                $event.preventDefault();
                var modalInstance = $uibModal.open({
                    backdrop: true,
                    scope: scope,
                    controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                        $scope.close = () => $uibModalInstance.close();
                    }],
                    template:
                        // `<div class="modal-header"><h4>Zoom</h4></div>
                        `<div class="modal-body">
                            <button type="button" class="close" aria-label="Close" ng-click="close()"><span aria-hidden="true">&times;</span></button>
                            <img ng-src="{{ image }}" class="img-thumbnail img-responsive"/>
                        </div>`
                });
                modalInstance.result.then(function() {}, function() {});
            }
        },
        template:
            `<img src="{{ thumbnail }}" class="poster_mini_thumbnail" ng-click="zoomThumbnail($event)"/>`
    };
}

zoomInModal.$inject = ['$uibModal'];

export default zoomInModal;
