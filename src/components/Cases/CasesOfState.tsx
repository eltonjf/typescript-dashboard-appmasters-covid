import React from 'react';

import moment from 'moment';
import Table from "../../components/Table/Table";

interface Props {
  
}

interface State {
  value: number;
  creatingMessage: boolean;
  messageSuccess: boolean;
  messageFailed: boolean;
  apiData: [[string, number, number, number]],
  dataUpdate: any;
  
}

export default class CasesOfState extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: 0,
      creatingMessage: false,
      messageSuccess: true,
      messageFailed: true,
      apiData: [['', 0, 0, 0]],
      dataUpdate: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  componentDidMount() {

    const apiUrl = 'https://covid19-brazil-api.now.sh/api/report/v1';
    const mountApi:any = [];
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {

      data.data.map((item:any) => {
        console.log(item)
        mountApi.push([item.state, item.cases, item.suspects, item.deaths])
        this.setState({dataUpdate: moment(item.datetime).format('DD/MM/YYYY hh:mm:ss')})
      })
      this.setState({apiData: mountApi})
      
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

    return (
        <Table 
            tableHeaderColor="warning"
            tableHead={["Estado", "Casos", "Suspeitos", "Óbitos"]}
            tableData={this.state.apiData}
      />
    )
  }
}