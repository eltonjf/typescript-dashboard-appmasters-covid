import React from 'react';

import moment from 'moment';
import DateRange from "@material-ui/icons/DateRange";
import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardIcon from '../Card/CardIcon';
import Store from "@material-ui/icons/Store";

import CardFooter from '../Card/CardFooter';
import GridItem from '../Grid/GridItem';
import { Icon } from '@material-ui/core';

interface Props {
    classes: any;
    name: string;
    valor: string;
    color: string;
    icon: string;
}

interface State {
  value: number;
  creatingMessage: boolean;
  messageSuccess: boolean;
  messageFailed: boolean;
  dataCard: { valor: number, color: string, name: string, dateUpdate: string, icon: string}
  
};


export default class CardTotal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: 0,
      creatingMessage: false,
      messageSuccess: true,
      messageFailed: true,
      dataCard: {
        valor: 0,
        color: '',
        name: '',
        dateUpdate: '',
        icon: ''
      },
    
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  componentDidMount() {

    const apiUrl = 'https://covid19-brazil-api.now.sh/api/report/v1/brazil';
    const mountApi:any = [];
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const nomeValor:string = data.data+'.'+ this.props.valor
        this.setState({
         dataCard: {
           valor: data.data.nomeValor,
           color: this.props.color,
           name: this.props.name,
           dateUpdate: moment(data.data.datetime).format('DD/MM/YYYY hh:mm:ss'),
           icon: this.props.icon
         }
        })
      })
    .catch(err => { 
      // trata se alguma das promises falhar
      console.error('Failed retrieving information', err); 
    });
  }
  



  handleChange = (event: any, value: number) => {
    this.setState({ value });
  };

  handleChangeIndex = (index: number) => {
    this.setState({ value: index });
  };


  render() {
    const { classes, name } = this.props;
    
    return (
        <GridItem xs={12} sm={6} md={3}>
           {/*  <Card>
              <CardHeader color={this.state.dataCard.color} stats={true} icon={true}>
                <CardIcon color={this.state.dataCard.color}>
                  <Icon>{this.state.dataCard.icon} </Icon>
                </CardIcon>
                <p className={classes.cardCategory}>{this.state.dataCard.name}</p>
                <h3 className={classes.cardTitle}>{this.state.dataCard.valor}</h3>
              </CardHeader>
              <CardFooter stats={true}>
                <div className={classes.stats}>
                  <DateRange />
                   {this.state.dataCard.dateUpdate}
                </div>
              </CardFooter>
            </Card> */}
        </GridItem>
    )
  }
}