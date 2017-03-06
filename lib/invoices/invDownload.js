function invDownload() {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      invoice: "&",
      size: "@",
      form: '=',
    },
    link: function(scope, element, attrs) {
      scope.invoice = scope.invoice();
      scope.url_factura = `${scope.invoice.values.getRequestedUrl().replace('facturas', 'ordenes')}/${scope.invoice.values.orden_id}/invoice`;
      scope.type = attrs.type;
    },
    template: `
<a class="btn" ng-class="size ? \'btn-outline btn-\' + size : \'btn-default\'" target="_self" ng-href="{{ url_factura }}">
    <span class="fa fa-file-pdf-o" aria-hidden="true"></span>&nbsp;Descargar
</a>
`
  };
}

export default invDownload;
