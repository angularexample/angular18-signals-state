import {computed, Injectable, Signal, signal, WritableSignal} from "@angular/core";

/**
 * XxxHomeStore is the feature state for the home page.
 * New state management for Angular using only Signals and RxJS.
 * If you already know NgRx then we have organized it using the same categories.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxHomeStore {
  // State is where we store all the properties needed to support the view.
  // private $homeState: WritableSignal<XxxContentState> = signal<XxxContentState>(xxxContentInitialState);


  // Selectors are used to read from state
  // $contents_ = computed(() => {this.$contentState().contents});

  // contentByKey_ = computed(() => {
  //   //const contents = this.$contents_;
  // })


  // Reducers are where we update state
  // getContentSuccess(content: XxxContent) {
  // }

  // Actions are used to trigger state changes which then change the view
  // If they need to operate Asychronously they are RxJS Subjects
  // If not then we can call the effect or reducer directly


  // Effects are for data access, navigation, or to open a dialog
  // They are often used to run a service
//   getContent$ = (key: string) => {
// };

  // showContent$(key: string){
  //   // this.actions$.pipe(
  //   //   ofType(XxxContentActions.showContent),
  //   //   concatLatestFrom((action: {
  //   //     key: string
  //   //   }) => this.store.select(XxxContentSelectors.selectIsContentLoaded(action.key))),
  //   //   filter(([_action, isLoaded]) => !isLoaded),
  //   //   map(([arg1, _arg2]) => arg1),
  //   //   map((action: { key: string }) => XxxContentActions.getContent({key: action.key}))
  //   // ));
  // }
}
