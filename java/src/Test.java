import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;

public class Test {
    public static void main(String[] args) {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setValidating(true);
        factory.setIgnoringElementContentWhitespace(true);
        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            File file = new File("Java/Livingston Campus Center.svg");
            Document doc = builder.parse(file);
            NodeList polygons = doc.getElementsByTagName("polygon");
            Node polygon = polygons.item(0);
            NamedNodeMap attributes = polygon.getAttributes();
            for(int i = 0; i < attributes.getLength(); i++){
                Node attribute = attributes.item(i);
                System.out.println(attribute.getNodeName());
                System.out.println(attribute.getNodeValue());
            }
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
