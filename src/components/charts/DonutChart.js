import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector } from 'recharts';
import $ from "jquery";


let data = [
    { name: 'Invoice Amount Received', value: 1, fill: '#00D632' },
    { name: 'QR Offline', value: 1, fill: '#077721' }
];

const renderActiveShape = (props) => {

    const RADIAN = Math.PI / 180;
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";


    return (
        <g>
            <text x={cx} y={cy-3} dy={8} fontSize="12" fontWeight={600} textAnchor="middle" fill={fill}>
                {/* {payload.name} */}
                {`${(percent * 100).toFixed(1)}%`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};



export default class DonutChart extends PureComponent {
    
    constructor(props) {
        super();
    }

    state = { activeIndex: null };
    onPieEnter = (_, index) => {
        this.setState({
            activeIndex: index
        });

        if(index===0) {
            $("#inv-pay-data").addClass("current-graph-data");
        }
        if(index===1) {
            $("#qr-pay-data").addClass("current-graph-data");
        }
    };

    onPieLeave = (_, index) => {
        $("#inv-pay-data").removeClass("current-graph-data");
        $("#qr-pay-data").removeClass("current-graph-data");
    }

    
    render() {

        if( this.props.props.ecom_payment !== undefined || this.props.props.qr_offline !== undefined ) {

            if(this.props.props.ecom_payment > 0 || this.props.props.qr_offline > 0 ) {
                data[0]["value"] = parseInt(this.props.props.ecom_payment);
                data[1]["value"] = parseInt(this.props.props.qr_offline);
            }


            return (
                <PieChart width={200} height={200} className='float-right'>
                    <Pie
                        activeIndex={this.state.activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={this.onPieEnter}
                        onMouseLeave={this.onPieLeave}
                        isAnimationActive={false}
                        stroke={0}
                    />
                </PieChart>
            );
        }
        else {
            return "Loading...";
        }

        
    }
}
