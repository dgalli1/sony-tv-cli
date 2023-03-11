import BraviaIpControlSimple from 'node-bravia-ip-control-simple';
const bravia = new BraviaIpControlSimple.BraviaDevice({
    address: '192.168.178.94'
  });
const commandArguments = process.argv.slice(2);
if(commandArguments.length == 0) {
    console.log("No command given");
    process.exit(1);
}
const command = commandArguments[0];
await bravia.connect();
console.log('connected');
let braviaCommand;
switch(command) {
    case 'poweron':
        braviaCommand = bravia.powerOn();
        break;
    case 'poweroff':
        braviaCommand = bravia.powerOff();
        break;
    case 'getscene':
        braviaCommand = bravia.getSceneSetting();
        break;
    case 'setscene':
        if(commandArguments.length < 2) {
            console.log("No scene given");
            await bravia.disconnect();
            process.exit(1);
        }
        const scene = commandArguments[1];
        braviaCommand = bravia.setSceneSetting({value: scene});
        break;

    case 'picture_bt2020':
        //irc we stop after this command
        braviaCommand = await bravia.setIrccCode({name: 'options'});
        braviaCommand = await bravia.setIrccCode({name: 'confirm'});
        //sleep for 500ms
        await new Promise(resolve => setTimeout(resolve, 600));
        //down 10 times
        for(let i = 0; i < 10; i++) {
            braviaCommand = await bravia.setIrccCode({name: 'down'});
            //sleep for 10ms
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        braviaCommand = await bravia.setIrccCode({name: 'confirm'});
        //down 5 times and then up 1 time to prevent missing signals
        for(let i = 0; i < 5; i++) {
            braviaCommand = await bravia.setIrccCode({name: 'down'});
            //sleep for 10ms
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        braviaCommand = await bravia.setIrccCode({name: 'up'});
        // right 4 times
        for(let i = 0; i < 4; i++) {
            braviaCommand = await bravia.setIrccCode({name: 'right'});
        }
        braviaCommand = await bravia.setIrccCode({name: 'return'});
        await bravia.disconnect();
        process.exit(0);
        break;
    case 'picture_desktop':
        //irc we stop after this command
        braviaCommand = await bravia.setIrccCode({name: 'options'});
        braviaCommand = await bravia.setIrccCode({name: 'confirm'});
        //sleep for 500ms
        await new Promise(resolve => setTimeout(resolve, 600));
        //down 10 times
        for(let i = 0; i < 10; i++) {
            braviaCommand = await bravia.setIrccCode({name: 'down'});
            //sleep for 10ms
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        braviaCommand = await bravia.setIrccCode({name: 'confirm'});
        //down 5 times and then up 1 time to prevent missing signals
        for(let i = 0; i < 5; i++) {
            braviaCommand = await bravia.setIrccCode({name: 'down'});
            //sleep for 10ms
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        braviaCommand = await bravia.setIrccCode({name: 'up'});
        // right 4 times
        for(let i = 0; i < 4; i++) {
            braviaCommand = await bravia.setIrccCode({name: 'left'});
        }
        braviaCommand = await bravia.setIrccCode({name: 'return'});
        await bravia.disconnect();
        process.exit(0);
        break;
    default:
        console.log("Unknown command: " + command);
        await bravia.disconnect();
        process.exit(1);
}
await braviaCommand;
console.log(braviaCommand);
await bravia.disconnect();