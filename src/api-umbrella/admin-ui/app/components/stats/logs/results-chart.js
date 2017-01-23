import Ember from 'ember';
import echarts from 'npm:echarts';

export default Ember.Component.extend({
  didInsertElement() {
    this.renderChart();
  },

  renderChart() {
    this.$()[0].style = "width: 100%; height: 220px; margin-top: 15px"
    this.chart = echarts.init(this.$()[0], 'api-umbrella-theme');
    this.draw();

    $(window).on('resize', _.debounce(this.chart.resize, 100));
  },

  refreshData: Ember.on('init', Ember.observer('hitsOverTime', function() {
    let data = []
    let labels = [];

    let hits = this.get('hitsOverTime');
    for(let i = 0; i < hits.length; i++) {
      data.push(hits[i].c[1].v);
      labels.push(hits[i].c[0].f);
    }

    this.setProperties({
      chartData: data,
      chartLabels: labels,
    });

    this.draw();
  })),

  draw() {
    if(!this.chart || !this.get('chartData')) {
      return;
    }

    let showAllSymbol = false;
    let lineWidth = 2;
    if(this.get('chartData').length < 100) {
      showAllSymbol = true;
      lineWidth = 4;
    }

    this.chart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        orient: 'vertical',
        iconStyle: {
          emphasis: {
            textPosition: 'left',
            textAlign: 'right',
          },
        },
        feature: {
          saveAsImage: {
            title: 'save as image',
            name: 'api_umbrella_chart',
            excludeComponents: ['toolbox', 'dataZoom'],
            pixelRatio: 2,
          },
          dataZoom: {
            yAxisIndex: 'none',
            title: {
              zoom: 'zoom',
              back: 'restore zoom',
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        minInterval: 1,
        splitNumber: 3,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.get('chartLabels'),
      },
      series: [
        {
          name: 'Hits',
          type: 'line',
          sampling: 'average',
          showAllSymbol: showAllSymbol,
          symbolSize: lineWidth + 4,
          areaStyle: {
            normal: {},
          },
          lineStyle: {
            normal: {
              width: lineWidth,
            },
          },
          data: this.get('chartData'),
        },
      ],
      title: {
        show: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
        left: 90,
        top: 10,
        right: 30,
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100,
        },
      ],
    });
  },
});
