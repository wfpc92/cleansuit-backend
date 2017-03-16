var moment = require('moment');
var fromNow = v => moment(v).fromNow();

module.exports = function(nga, admin) {

  return nga.dashboard()
    .addCollection(nga.collection(admin.getEntity('ordenes'))
      .name('monthly_revenue')
      .title('Facturación')
      //.permanentFilters({ date: { gte: moment().substract(1, 'months').toDate() } })
      .fields([
        nga.field('fecha', 'datetime')
          .format('dd MMM /yy - hh:mm a'),
        nga.field('total', 'amount')
      ])
      .sortField('fecha')
      .sortDir('ASC')
      .perPage(20)
    )
    .addCollection(nga.collection(admin.getEntity('ordenes'))
      .name('pending_orders')
      .title('Ordenes Pendientes')
      .fields([
        nga.field('codigo')
          .label('COD')
          .isDetailLink(true),
        nga.field('fecha', 'datetime')
          .format('dd MMM /yy - hh:mm a'),
        nga.field('cliente_id', 'reference')
          .label('Cliente')
          .targetEntity(admin.getEntity('usuarios'))
          .targetField(nga.field('nombre'))
          .singleApiCall(ids => ({
            'id': ids
          }))
          .cssClasses('hidden-xs')
          .isDetailLink(false),
        // nga.field('nb_items')
        //  .label('Items')
        //  .map((v, e) => e.basket.length),
        nga.field('orden.totales.total', 'amount')
          .cssClasses('amount')
          .label('Total')
      ])
      .permanentFilters({
        estado: 'nueva'
      })
      .sortField('fecha')
      .sortDir('DESC')
    )
    .addCollection(nga.collection(admin.getEntity('usuarios'))
      .name('new_customers')
      .title('Últimos Clientes')
      .fields([
        nga.field('profile.url_foto', 'template')
          .label('')
          .template(entry => `<img ng-if="entry.values['profile.url_foto']" src="${ entry.values['profile.url_foto'] }" width="25" style="margin-top:-4px" />`),
        nga.field('nombre')
          .label('Nombre')
          .isDetailLink(true),
        nga.field('createdAt', 'datetime')
          .label('Registro')
          .map(fromNow),
      ])
      .permanentFilters({
        rol: 'cliente'
      })
      .sortField('createdAt')
      .sortDir('DESC')
      .perPage(20)
    )
    .template(`
<div class="row dashboard-starter"></div>
<dashboard-summary></dashboard-summary>
<div class="row dashboard-content">
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.pending_orders" entries="dashboardController.entries.pending_orders" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.new_customers" entries="dashboardController.entries.new_customers" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
</div>
`);
}
