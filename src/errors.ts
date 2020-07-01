export class LinkdNotFound extends Error {

  public statusCode = 404;
  public idNotFound: string;

  public constructor (id: string) {
    super();
    this.idNotFound = id;
  }

}

export class LinkdAlreadyExists extends Error {

  public statusCode = 400;

}
