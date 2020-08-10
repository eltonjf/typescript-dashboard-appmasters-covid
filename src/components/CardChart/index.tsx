import React from 'react';
import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import ChartistGraph from 'react-chartist';
import CardBody from '../Card/CardBody';
import CardFooter from '../Card/CardFooter';

interface Props {
    classes: any;
    color: "success" | "warning" | "danger" | "info" | "primary";
    type: "Line" | "Bar";
    value: {};
    title: string;
    icon: React.ReactElement;
    footer: string;
    footerIcon: React.ReactElement;
}

class CardChart extends React.Component<Props, {}>{
    render(){
        const { classes, color, type, value, title, icon, footer, footerIcon } = this.props;
        return(
            <Card chart={true}>
              <CardHeader color={color}>
                <ChartistGraph
                  className="ct-chart"
                  data={value}
                  type={type}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>{title}</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    {icon} 55%
                  </span>{" "}
                  increase in today sales.
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  {footerIcon} {footer}
                </div>
              </CardFooter>
            </Card>
        )
    }
}

export default CardChart;