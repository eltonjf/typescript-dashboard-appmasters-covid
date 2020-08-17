import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import CheckIcon from '@material-ui/icons/Check';
// core components
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import Table from "../../components/Table/Table";
import Tasks from "../../components/Tasks/Tasks";
import CustomTabs from "../../components/CustomTabs/CustomTabs";
import Danger from "../../components/Typography/Danger";
import Card from "../../components/Card/Card";
import Button from '../../components/CustomButtons/Button';
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";

import { bugs, website, server } from "../../variables/general";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "../../variables/charts";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle";
import CustomInput from "../../components/CustomInput/CustomInput";
import { InputLabel, FormControl, Select, MenuItem } from "@material-ui/core";
import Success from "../../components/Typography/Success";

import moment from 'moment';
import CardDash from "../../components/CardDash";
import CardChart from "../../components/CardChart";

interface Props {
  classes: any;
}

interface Response {
  country: string;
  cases: number;
  suspects: number;
  deaths: number;
  refuses: number;
  updated_at: string | Date;
}


interface ResponseList {
  cases: number;
  uf:string;
  state: string;
  deaths: number;
  suspects: number;
  datetime: string | Date;
}

interface State {
  selectedState: string;
  creatingMessage: boolean;
  messageSuccess: boolean;
  messageFailed: boolean;
  data: Response;
  dataList: ResponseList[];
  dateUpdateList: string | Date;
  dataBox: ResponseListBox[];
  dataDateList: ResponseList[][];
  selectedDay: string;
  }

  interface ResponseListBox {
    uf: string;
    state: string;
    uid: number;
  }

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedState: "MG",
      creatingMessage: false,
      messageSuccess: true,
      messageFailed: true,
      data: {
        country: "",
        cases: 0,
        refuses: 0,
        deaths: 0,
        suspects: 0,
        updated_at: "",
      },
      dataList: [],
      dateUpdateList: '',
      dataBox: [],
      dataDateList: [[]],
      selectedDay: '5',
    };

  }

   componentDidMount  = async () =>  {
    const responseBox = (await fetch(
      "https://covid19-brazil-api.now.sh/api/report/v1"
    ).then((resp) => resp.json())) as {
      data: ResponseListBox[];
    }

    const response = (await fetch(
      `https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${responseBox.data[0].uf}`
    ).then((resp) => resp.json())) as Response;

    const responseList = (await fetch(
        "https://covid19-brazil-api.now.sh/api/report/v1"
      ).then((resp) =>resp.json())) as {
        data: ResponseList[];
    }

    const listDate: ResponseList[][] = [];

    const today = moment(new Date());
    const listOfDates  = [];
    let i = 1
    
    while(listDate.length < parseInt(this.state.selectedDay)){
        const responseList = await fetch(
          `https://covid19-brazil-api.now.sh/api/report/v1/brazil/${
            moment(today).subtract(i, 'days').format('YYYYMMDD')}`).then((resp) => resp.json()) as {
              data: ResponseList[];
          }       

          if(responseList.data.length > 0) listDate.unshift(responseList.data)
          i++
      }
    
    this.setState({data: response, dataList: responseList.data, 
              dataDateList: listDate, dataBox: responseBox.data,
              selectedState: responseBox.data[0].uf})
      
  } 

  handleChangeState = async (value: string) => {
    const response = (await fetch(
      `https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${value}`
    ).then((resp) => resp.json())) as Response;

    this.setState({ data: response, selectedState: value,  });
  };

  handleChangeDays = async (value: string) => {
      
    const listDate: ResponseList[][] = [];

    const today = moment(new Date());
   
    let i = 1
    
    while(listDate.length < parseInt(value)){
        const responseList = await fetch(
          `https://covid19-brazil-api.now.sh/api/report/v1/brazil/${
            moment(today).subtract(i, 'days').format('YYYYMMDD')}`).then((resp) => resp.json()) as {
              data: ResponseList[];
          }       
                  
          if(responseList.data.length > 0) listDate.unshift(responseList.data)
          i++
      }

    this.setState({selectedDay: value, dataDateList: listDate });
  };


  render() {
    const { classes } = this.props;
    const { creatingMessage, messageFailed, messageSuccess } = this.state;
    return (
      <div>
 
        <GridContainer>
        <div style={{ padding: 20 }}>
            <form>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="states-simple">Estados</InputLabel>
                <Select
                  value={this.state.selectedState}
                  onChange={(e) => this.handleChangeState(e.target.value)}
                  style={{ width: 200 }}
                  inputProps={{
                    name: "states",
                    id: "states-simple",
                  }}
                >
                   
                  {this.state.dataBox.map((item) => {
                    return <MenuItem key={item.uid} value={item.uf}>{item.state}</MenuItem>
                  })}


                  {/* <MenuItem value="MG">
                    <em>Minas Gerais</em>
                  </MenuItem>
                  <MenuItem value={"RJ"}>Rio de Janeiro</MenuItem>
                  <MenuItem value={"ES"}>Espírito Santo</MenuItem>
                  <MenuItem value={"SP"}>São Paulo</MenuItem> */}
                </Select>
              </FormControl>
            </form>
          </div>
          </GridContainer>

          <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
              <CardDash
                classes={classes}
                color={"warning"}
                title={"Casos"}
                value={this.state.data.cases}
                icon={<Warning />}
                footer={moment(this.state.data.updated_at).format('DD-MM-YYYY H:mm:ss')}
                footerIcon={<DateRange />}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <CardDash
                classes={classes}
                color={"success"}
                title={"Confirmados"}
                value={this.state.data.refuses}
                icon={ <Store />}
                footer={moment(this.state.data.updated_at).locale('pt-br').format('DD-MM-YYYY H:mm:ss')}
                footerIcon={<DateRange />}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <CardDash
                classes={classes}
                color={"info"}
                title={"Recuperados"}
                value={this.state.data.suspects}
                icon={ <Update />}
                footer={moment(this.state.data.updated_at).locale('pt-br').format('DD-MM-YYYY H:mm:ss')}
                footerIcon={<DateRange />}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <CardDash
                classes={classes}
                color={"danger"}
                title={"Óbitos"}
                value={this.state.data.deaths}
                icon={ <LocalOffer />}
                footer={moment(this.state.data.updated_at).locale('pt-br').format('DD-MM-YYYY H:mm:ss')}
                footerIcon={<DateRange />}
              />
            </GridItem>
        
          
          {/* <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats={true} icon={true}>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p className={classes.cardCategory}>Revenue</p>
                <h3 className={classes.cardTitle}>$34,245</h3>
              </CardHeader>
              <CardFooter stats={true}>
                <div className={classes.stats}>
                  <DateRange />
                  Last 24 Houees
                </div>
              </CardFooter>
            </Card> 
          </GridItem> */}

          {/* <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats={true} icon={true}>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Used Space</p>
                <h3 className={classes.cardTitle}>
                  49/50 <small>GB</small>
                </h3>
              </CardHeader>
              <CardFooter stats={true}>
                <div className={classes.stats}>
                  <Danger>
                    <Warning />
                  </Danger>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Get more space
                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats={true} icon={true}>
                <CardIcon color="danger">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Fixed Issues</p>
                <h3 className={classes.cardTitle}>75</h3>
              </CardHeader>
              <CardFooter stats={true}>
                <div className={classes.stats}>
                  <LocalOffer />
                  Tracked from Github
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats={true} icon={true}>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Followers</p>
                <h3 className={classes.cardTitle}>+245</h3>
              </CardHeader>
              <CardFooter stats={true}>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem> */}
        </GridContainer>

 <GridContainer>
        <div style={{ padding: 20 }}>
            <form>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="days-simple">Selecione o número de Dias</InputLabel>
                <Select
                  value={this.state.selectedDay}
                  onChange={(e) => this.handleChangeDays(e.target.value)}
                  style={{ width: 200 }}
                  inputProps={{
                    name: "days",
                    id: "days-simple",
                  }}
                >
                  <MenuItem value="5">
                    <em>5 dias</em>
                  </MenuItem>
                  <MenuItem value={"7"}>7 dias</MenuItem>
                  <MenuItem value={"10"}>10 dias</MenuItem>
                  <MenuItem value={"15"}>15 dias</MenuItem>
                </Select>
              </FormControl>
            </form>
          </div>
          </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
          
            <Card chart={true}>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={{
                    labels:
                      this.state.dataDateList.length > 0
                        ? this.state.dataDateList.map((item) => {
                            return moment(
                              item.length > 0 ? item[0].datetime : undefined
                            ).format("DD/MM/YYYY");
                          })
                        : undefined,
                    series: [
                      this.state.dataDateList.map((item) => {
                        return item.length > 0
                          ? item
                              .map((item) => {
                                return item.deaths;
                              })
                              .reduce((a, b) => a + b)
                          : undefined;
                      }),
                    ],
                  }}
                  type="Line"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Total de óbitos nos últimos {this.state.selectedDay} dias no Brasil</h4>
                {/* <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in today sales.
                </p> */}
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> Atualizado em:  {this.state.dataList.length > 0 ? moment(this.state.dataList[0].datetime).locale('pt-br').format('DD-MM-YYYY H:mm:ss') : undefined}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          
          <GridItem xs={12} sm={12} md={12}>
            <Card chart={true}>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart" 
                  data={{
                    labels: this.state.dataList.map((item) => {
                      return item.uf
                    }),
                    series: [this.state.dataList.map((item) => {
                        return item.deaths
                      })
                    ]
                  }}
                  type="Bar"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Total de mortes por estado</h4>
                <p className={classes.cardCategory}>
                  
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> Atulizado em: {this.state.dataList.length > 0 ? moment(this.state.dataList[0].datetime).locale('pt-br').format('DD-MM-YYYY H:mm:ss') : undefined}
                </div>
              </CardFooter>
            </Card>
            </GridItem>
            {/* <GridItem xs={12} sm={12} md={4}>
             <Card chart={true}>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={emailsSubscriptionChart.data}
                  type="Bar"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                <p className={classes.cardCategory}>
                  Last Campaign Performance
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card> 
          </GridItem> */}

        {/*   <GridItem xs={12} sm={12} md={4}>
            <Card chart={true}>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={completedTasksChart.data}
                  type="Line"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Completed Tasks</h4>
                <p className={classes.cardCategory}>
                  Last Campaign Performance
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer>
           <GridItem xs={12} sm={12} md={6}>
            <CustomTabs
              title="Tasks:"
              headerColor="primary"
              tabs={[
                {
                  tabName: "Bugs",
                  tabIcon: BugReport,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[0, 3]}
                      tasksIndexes={[0, 1, 2, 3]}
                      tasks={bugs}
                    />
                  ),
                },
                {
                  tabName: "Website",
                  tabIcon: Code,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[0]}
                      tasksIndexes={[0, 1]}
                      tasks={website}
                    />
                  ),
                },
                {
                  tabName: "Server",
                  tabIcon: Cloud,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[1]}
                      tasksIndexes={[0, 1, 2]}
                      tasks={server}
                    />
                  ),
                },
              ]}
            />
          </GridItem>  */}
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Total de casos e óbitos por Estado</h4>
                <p className={classes.cardCategoryWhite}>
                  Dados atualizados em: 
                </p>
              </CardHeader>
              <CardBody>              
                 <Table 
                  tableHeaderColor="warning"
                  tableHead={["Estado", "Casos", "Suspeitos", "Óbitos"]}     
                  tableData={this.state.dataList
                    .sort((a,b) => (a.state > b.state ? 1 : -1))
                    .map((item) => {
                      return [
                        item.state,
                        item.cases,
                        item.suspects,
                        item.deaths
                      ]
                    })
                  }


                  /* tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"],
                  ]} */

                />  
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        {/* <GridContainer>
          <GridItem xs={12}>
          <Card>
              <CardHeader color="success">
                <div className={classes.messages}>
                  <h4 className={classes.cardTitleWhite}>Mensagens Positivas</h4>
                  {!creatingMessage && (
                    <Button 
                      color="transparent" 
                      variant="outlined" 
                      onClick={() => this.setState({ creatingMessage: true })}
                    >
                      Enviar Mensagem
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {!creatingMessage 
                  ? <React.Fragment>
                      <h5 className={classes.cardTitle}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac est pulvinar, tempor turpis id, 
                        vehicula magna.
                      </h5>
                      <p className={classes.cardCategory}>
                        Jane Doe
                      </p>
                    </React.Fragment> 
                  : <React.Fragment>
                      <GridContainer>
                        <GridItem xs={12}>
                          <CustomInput
                            labelText="Nome"
                            id="name"
                            color="success"
                            formControlProps={{
                              fullWidth: true
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12}>
                        <CustomInput
                          labelText="Mensagem"
                          id="message"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 5
                          }}
                        />
                        </GridItem>
                      </GridContainer>
                    </React.Fragment>
                }
              </CardBody>
              {creatingMessage && (
                <CardFooter>
                  <Button color="danger" onClick={() => this.setState({ creatingMessage: false })} >Cancelar</Button>
                  <Button color="success">Enviar Mensagem</Button>
                </CardFooter>
              )}
              {messageFailed && (
                <CardFooter>
                  <div className={classes.stats}>
                    <Danger>
                      <Warning />
                      Falha ao enviar mensagem
                    </Danger>
                  </div>
                </CardFooter>
              )}
              {messageSuccess && (
                <CardFooter>
                  <div className={classes.stats}>
                    <Success>
                      <CheckIcon />
                      Mensagem enviada com sucesso
                    </Success>
                  </div>
                </CardFooter>
              )}
            </Card>
          </GridItem>
        </GridContainer> */}
      </div>
    );
  }
}

export default withStyles(dashboardStyle)(Dashboard);
