/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React from 'react';
 import {
   SafeAreaView,
   StyleSheet,
   ScrollView,
   View,
   Text,
   StatusBar,
   TouchableOpacity
 } from 'react-native';
 
 import branch, { BranchEvent } from 'react-native-branch'
 
 import {
   Header,
   LearnMoreLinks,
   Colors,
   DebugInstructions,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
 
 class App extends React.Component {
   state = {
     branchLink: "Clickk on create url"
   }

    
   componentDidMount() {
     this.subscribeToBranch()
   }
 
   subscribeToBranch = () => {
    branch.subscribe(({ error, params }) => {
      /*
        If deep link is NOT from branch.
        Example : custom uri scheme like : betterhalf:// or any other
        deep links other than Branch.
        */
      if (params?.['+non_branch_link']) {
        const nonBranchUrl = params?.['+non_branch_link'];
        deepLinkURLhandler(nonBranchUrl);
        return;
      }

      /* If the app opens without a deep link */
      if (!params?.['~referring_link']) {
        return;
      }

      if (error) {
        console.error(`Error from Branch: ${error}`);
        return;
      }

      if (!params['+clicked_branch_link']) {
        /* Indicates initialization success and some other conditions.
          No link was opened. */
        return;
      }

      const queryParamString = constructQueryParamStringFromBranchParams(
        params,
      );

      const uriWithQueryParams = `${params['~referring_link']}${
        queryParamString ? `?${queryParamString}` : ''
      }`;

      // A Branch link was opened.
      // Route link based on data in params, e.g.
      deepLinkURLhandler(uriWithQueryParams);
    });
   }


   
 
   showShare = async () => {
     let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
       locallyIndex: true,
       title: 'Cool Content!',
       contentDescription: 'Cool Content Description',
       contentMetadata: {
         ratingAverage: 4.2,
         customMetadata: {
           prop1: 'test',
           prop2: 'abc'
         }
       }
     })
 
     let shareOptions = { messageHeader: 'Check this out', messageBody: 'No really, check this out!' }
     let linkProperties = { feature: 'share', channel: 'RNApp' }
     let controlParams = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }
     let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
     console.log(channel, completed, error)
   }

   logCommerce = async () => {
    let buo = await branch.createBranchUniversalObject(
      "item/12345",
      {
        canonicalUrl: "https://branch.io/item/12345",
        title: "My Item Title",
        contentMetadata: {
          quantity: 1,
          price: 23.20,
          sku: "1994320302",
          productName: "my_product_name1",
          productBrand: "my_prod_Brand1",
          customMetadata: {
                custom_key1: "custom_value1",
                custom_key2: "custom_value2"
                }
        }
        }
    )
    
    let params = {
      transaction_id: "tras_Id_1232343434",
      currency: "USD",
      revenue: 180.2,
      shipping: 10.5,
      tax: 13.5,
      coupon: "promo-1234",
      affiliation: "high_fi",
      description: "Preferred purchase",
      purchase_loc: "Palo Alto",
      store_pickup: "unavailable",
      custom_data: {
       "Custom_Event_Property_Key1": "Custom_Event_Property_val1",
       "Custom_Event_Property_Key2": "Custom_Event_Property_val2"
      }
    }
    let event = new BranchEvent(BranchEvent.Purchase, [buo], params)
    event.logEvent()
} 


logClovio = async () => {
  let params = {
    alias: "my custom alias",
    description: "Product Search",
      searchQuery: "user search query terms for product xyz",
    custom_data: {
     "Custom_Event_Property_Key1": "Custom_Event_Property_val1",
     "Custom_Event_Property_Key2": "Custom_Event_Property_val2"
    }
  }
  let event = new BranchEvent("View Itemss", params)
  event.logEvent()

}





  
 
   createBranchLink = async () => {
     // only canonicalIdentifier is required
     let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
       locallyIndex: true,
       title: 'Cool Content!',
       contentDescription: 'Cool Content Description',
       contentMetadata: {
         ratingAverage: 4.2,
         customMetadata: {
           prop1: 'test',
           prop2: 'abc'
         }
       }
     })
 
     let linkProperties = {
         feature: 'share',
         channel: 'facebook'
     }
 
     let controlParams = {
         $desktop_url: 'http://desktop-url.com/monster/12345'
     }
 
     let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
     this.setState({branchLink: url})
     console.log(url)
   }
   
   render() {
     return (
       <React.Fragment>
         <StatusBar barStyle="dark-content" />
         <SafeAreaView>
           <ScrollView
             contentInsetAdjustmentBehavior="automatic"
             style={styles.scrollView}>
             <Header />
             {global.HermesInternal == null ? null : (
               <View style={styles.engine}>
                 <Text style={styles.footer}>Engine: Hermes</Text>
               </View>
             )}
             <View style={styles.body}>
               <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10, margin: 10}} onPress={this.createBranchLink}>
                 <Text>Create url</Text>
               </TouchableOpacity>
             <Text>{this.state.branchLink}</Text>
             <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10, margin: 10}} onPress={this.showShare}>
               <Text>Show Share Sheet</Text>
             </TouchableOpacity>

             <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10, margin: 10}} onPress={this.logCommerce}>
               <Text>Log Purchase event</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10, margin: 10}} onPress={this.logClovio}>
               <Text>Log Clovio Event</Text>
             </TouchableOpacity>
             </View>
           </ScrollView>
         </SafeAreaView>
       </React.Fragment>
     );
   }
 }
 
 const styles = StyleSheet.create({
   scrollView: {
     backgroundColor: Colors.lighter,
   },
   engine: {
     position: 'absolute',
     right: 0,
   },
   body: {
     flex: 1,
     alignItems: "center",
     backgroundColor: Colors.white,
   },
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
     color: Colors.black,
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
     color: Colors.dark,
   },
   highlight: {
     fontWeight: '700',
   },
   footer: {
     color: Colors.dark,
     fontSize: 12,
     fontWeight: '600',
     padding: 4,
     paddingRight: 12,
     textAlign: 'right',
   },
 });
 
 export default App;