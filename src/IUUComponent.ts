// TypeScript file
interface IUUComponent {
    getProps ();
    setProps (props: any);
    redraw: () => void;
    dispose ():void;
}