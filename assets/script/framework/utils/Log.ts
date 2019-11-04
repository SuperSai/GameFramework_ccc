

export default class Log {

    /**
      * Debug_Log
      * @param messsage 内容
      */
    public static trace(...optionalParams: any[]): void {
        // if (Apps.isLog) {
        optionalParams[0] = "@David [DebugLog]" + optionalParams[0];
        console.log.apply(console, optionalParams);
        // }
    }

	/**
	 * Error_Log
	 * @param messsage 内容
	 */
    public static traceError(...optionalParams: any[]): void {
        optionalParams[0] = "@David [ErrorLog]" + optionalParams[0];
        console.error.apply(console, optionalParams);
    }
}
