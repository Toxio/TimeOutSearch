export class App {
  constructor() {
    const UNKNOWN_USER = 'no information about preferences';
    this.users = {};
    this.venues = {};
    this.receiveInformation();
  }

  receiveInformation() {
    fetch('./data/users.json')
      .then( resp => resp.json() )
      .then( data => this.users = data );

    fetch('./data/venues.json')
      .then( resp => resp.json() )
      .then( data => {
        this.venues = data;
        this.venues.forEach( venue => venue.problems = []);
      });
  }

  clearAll() {
    $('#visitors').html('');
    $('#recomendList').html('');
    $('#avoidList').html('');
    this.receiveInformation();
  }

  findVenues(user) {
    for (let venue of this.venues ) {
      let drinkMatch = false;
        //delete food from venues if match
      user.wont_eat.forEach( meal => {
        const index = venue.food.indexOf(meal);
        if (index > -1) {
          venue.food.splice(index, 1);
          venue.problems.push(`${user.name} doesn’t eat ${meal}`);
        }
      });
      user.drinks.forEach( drink => {
        const index = venue.drinks.indexOf(drink);
        if ( index > -1 ) drinkMatch = true;
      });
      //clear all array if no drinks for user
      if ( !drinkMatch && venue.drinks.length) {
        venue.drinks = [];
        venue.problems.push(`${user.name} without any drinks`);
      }
    }
  }

  addVisitor(person) {
    const serchList = $('.visitorsList');
    let user = this.findUser(person);
    if (user) {
      this.findVenues(user);
      this.showRecomendedVenues();
      this.showAvoidVenues();
    } else {
      user = {};
      user.name = person + ` (${ this.UNKNOWN_USER })`;
    }

    if (serchList.length) {
      serchList.append(createListEl());
    } else {
      let output =
        `<ul class="visitorsList">
          <h4>Visitors:</h4>
          ${ createListEl() }
         </ul>`;
      $('#visitors').html(output);
    }

    function createListEl() {
      return `<li> ${user.name} </li>`;
    }
  }

  findUser(person) {
    const user = this.users.find( item => {
      return item.name === person;
    });
    return user;
  }

  showRecomendedVenues() {
    let output =
    `<ul class="recomendationList">
      <h4>Places to go:</h4>
      ${ placesToGo(this.venues) }
      </ul>`;

    $('#recomendList').html(output);

    function placesToGo(venues) {
      let venuesList = '';
      venues.map( venue => {
        if ( venue.food.length && venue.drinks.length ) {
          venuesList += `<li> ${ venue.name } </li>` ;
        }
      })
      return  venuesList;
    }
  }

  showAvoidVenues(){
    let output =
    `<ul class="avoidList">
      <h4>Places to avoid:</h4>
      ${ placesToAvoid(this.venues) }
      </ul>`;

    $('#avoidList').html(output);

    function placesToAvoid(venues) {
      let venuesList = '';
      venues.map( venue => {
        if ( !venue.food.length || !venue.drinks.length ) {
          venuesList +=
          `<li> ${ venue.name }
            <ul class="problemList">
              ${problemList(venue)}
            </ul>
           </li>` ;
        }
      })
      return  venuesList;
    }

    function problemList(venue){
        let problems = '';
        venue.problems.map( problem => {
            problems += `<li> ${ problem } </li>`;
        })
        return  problems;
    }
  }
}
